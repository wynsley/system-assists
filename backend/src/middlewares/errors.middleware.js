function errorsMiddleware(err, req, res, next) {
  console.error(err);

  // Prisma: valor único duplicado
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Ya existe un registro con ese valor único",
      field: err.meta?.target,
    });
  }

  // Prisma: no encontrado
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Registro no encontrado",
    });
  }

  // Error personalizado (validaciones)
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // Error desconocido
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
}

export { errorsMiddleware };
