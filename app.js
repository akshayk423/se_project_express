const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGODB_URI, PORT } = require('./utils/config');
const errorHandler = require('./middlewares/error-handler');

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

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

const routes = require('./routes/index');

app.use(requestLogger);
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
