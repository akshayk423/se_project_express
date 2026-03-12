module.exports = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message:
      err.statusCode === 500 ? 'An error occurred on the server' : err.message,
  });
};
