const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGODB_URI, PORT } = require('./utils/config');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URI);

const routes = require('./routes/index');

app.use('/', routes);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
