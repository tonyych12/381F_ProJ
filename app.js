const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

mongoose.connect(
  'mongodb+srv://s1335778:Abcd1234@cluster0.yaw2iaa.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'testSecret',
    resave: false,
    saveUninitialized: true,
  })
);

function generateToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

const User = mongoose.model('User', {
  username: String,
  password: String,
});

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, password: hashedPassword });
  await user.save();

  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'Authentication failed' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ success: false, message: 'Authentication failed' });
  }

  req.session.user = user;
  return res
    .status(200)
    .json({ success: true, message: 'Authentication succeeded' });
});

app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
});

function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.use(requireLogin);

const Note = mongoose.model('Note', {
  userId: mongoose.Types.ObjectId,
  text: String,
});

app.get('/notes', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user._id;
  const notes = await Note.find({ userId });

  res.render('notes.ejs', { user: req.session.user, notes });
});

app.post('/notes', async (req, res) => {
  const userId = req.session.user._id;
  const { text } = req.body;

  const note = new Note({ userId, text });
  await note.save();

  res.redirect('/notes');
});

app.post('/notes/delete/:noteId', async (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authenticated' });
  }

  const userId = req.session.user._id;
  const noteId = req.params.noteId;

  try {
    const note = await Note.findOne({ userId, _id: noteId });
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: 'Note not found' });
    }

    await Note.deleteOne({ _id: noteId });

    return res.redirect('/notes');
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error deleting the note' });
  }
});

app.put('/notes/update/:noteId', async (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authenticated' });
  }

  const userId = req.session.user._id;
  const noteId = req.params.noteId;
  const newText = req.body.text;

  try {
    const note = await Note.findOne({ userId, _id: noteId });
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: 'Note not found' });
    }

    note.text = newText;
    await note.save();

    return res
      .status(200)
      .json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error updating the note' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
