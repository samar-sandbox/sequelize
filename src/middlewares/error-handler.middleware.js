export default function errorHandler(err, req, res, next) {
  const message =
    err.errors?.length > 0
      ? err.errors.map((e) => e.message).join(", ")
      : err.message;

  return res.status(500).json({
    success: false,
    message,
  });
}
