# ☔WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

### Technologies

- Node.js + Express.js
- Nodemon
- Mongoose
- MongoDB
- Validator
- Bcrypt
- JSON Web Token (JWT)

### Project Structure

.
├── controllers
│ ├── clothingItems.js # Logic for clothing item routes
│ └── users.js # Logic for user-related routes
│
├── middlewares
│ └── auth.js # Authentication middleware
│
├── models
│ ├── clothingItem.js # Mongoose schema for clothing items
│ └── user.js # Mongoose schema for users
│
├── routes
│ ├── clothingItems.js # Routes for clothing item endpoints
│ ├── users.js # Routes for user endpoints
│ └── index.js # Main router entry point
│
├── utils
│ ├── config.js # Environment & configuration variables
│ └── errors.js # Custom error classes and handlers
│
├── .editorconfig # Editor formatting rules
├── .eslintrc # ESLint configuration
├── .gitignore # Git ignored files
├── app.js # Express app setup and middleware
├── package.json # Project metadata and dependencies
└── README.md # Project documentation

### Endpoints

- User Endpoints:

  - `POST /signin`: for user log in, assigns JWT token when login is successful
  - `POST /signup`: for creating a new user
  - `GET /users/me`: for returning user data
  - `PATCH /users/me`: for updating user profile

- Clothing Item Endpoints:
  - `GET /items`: returns all items from the database
  - `POST /items`: creates a clothing item with `name`, `imageUrl`, and `weather` passed in request body. owner is set by the `req.user_id`
  - `DELETE /items/:id`: deletes an item by id. User is not allowed to delete a card they didn't create
  - `PUT /items/:id/likes`: likes a clothing item
  - `DELETE /items/:id/likes`: unlikes a clothing item

### Endpoint Errors

- `400` — invalid data passed to the methods for creating an item/user or
  updating an item

- `400` — an invalid ID passed to the params:
  GET <http://localhost:3001/users/invalidid> // CastError
  GET <http://localhost:3001/users/61cb4d051586a1fe37 //CastError

- `401` — there is something wrong with authorization; i.e., an incorrect email
  or password, the token is invalid, or an unauthorized user is trying to
  access protected routes.

- `403` — the user is trying to remove the card of another user.

- `404` — there is no user or clothing item with the requested id or the
  request was sent to a non-existent address.

- `409` — when registering, the user entered an email address that already
  exists on the server.

- `500` — default error. Accompanied by the message: “An error has
  occurred on the server.

### Schemas

- User:

  - `name`: required string from 2 to 30 characters
  - `avatar`: required string for a URL
  - `email`: required unique string
  - `password`: required string with the `select` property value false

- Item:
  - `name`: required string from 2 to 30 characters
  - `weather`: required string with the `enum` validator with defined weather types (`hot`, `warm`, `cold`)
  - `imageUrl`: required string for URL
  - `owner`: required `ObjectId` with a link to the user schema
  - `likes`: required `ObjectId` array with a link to the user schema
  - `createdAt`: required `Date`

### Pitch Video

[Click Here](https://www.loom.com/share/982ad1317f7a480ab2e19f090f791839)
