export function notFoundMiddleware(
  req,
  res,
) {
  return res.status(404).json({
    message: "API route not found.",
  });
}