Group Nuumber: 09
Student name: CHUENG HOI, LAU CHUNG YIN, KAN CHING HANG, 
SID: 13396064, 13199505, 13357782, 13231208
Project Name: Notes App

A simple Notes application implemented using Node.js, EJS, MongoDB and Render for cloud deployment.

## Implementation

#Deployed the APP on cloud (Render)

To start running the application: 
https://three81f-proj.onrender.com/

# API Endpoints

The application exposes the following API endpoints:

POST /register: User registration
POST /login: User login
GET /logout: User logout
GET /notes: Retrieve user's notes
POST /notes: Create a new note
PUT /notes/:noteId: Update a note
DELETE /notes/:noteId: Delete a note

# Front end

In Views directory

index.ejs home file (This is the signup page)
![image](https://github.com/tonyych12/381F_ProJ/assets/48938660/b5679d56-2079-4457-b91c-2995653a441c)

login.ejs login file (This is a login page)
![image](https://github.com/tonyych12/381F_ProJ/assets/48938660/62996a8b-b2e0-436d-bdc1-98a1698c2f14)

notes.ejs mainHome file (This is the main page, it¡¥s shown all the basic services about the CRUD)
![image](https://github.com/tonyych12/381F_ProJ/assets/48938660/6544c961-1ab2-4d00-bba6-4b129e0ddfcf)

# Ejs used

Ejs is used to make the Frontend

# Mongodb used

Mongodb has been used to store the data in the database

# Session Cookie (Used JWT format)
![image](https://github.com/tonyych12/381F_ProJ/assets/48938660/7ce6e005-295f-4fe6-af32-ffddfeb34e34)

