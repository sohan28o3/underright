export function errorMiddleware(
  error,
  req,
  res,
  next,
) {
  console.error(
    `[${req.method}] ${req.originalUrl}`,
    error,
  );

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message:
      "An unexpected server error occurred.",
  });
}