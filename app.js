const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { port = 3001 } = process.env;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

const routes = require('./routes/index');

app.use((req, res, next) => {
  req.user = {
    _id: '692d606a007d04534aadd32e', // paste the _id of the test user created in the previous step
  };
  next();
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
