export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "NodemailerError") {
    return res.status(500).json({
      message: "Email service error. Please try again later.",
    });
  }

  res.status(500).json({
    message: "Something went wrong!",
  });
};
