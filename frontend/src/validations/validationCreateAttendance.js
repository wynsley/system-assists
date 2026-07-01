import Joi from "joi"

const ATTENDANCE_STATUSES = ["PRESENTE", "TARDANZA", "JUSTIFICADA"]; // 👈 corregido: era AUSENTE, ahora JUSTIFICADA

const ValidationCreateAttendance = Joi.object({
  date: Joi
    .date()
    .required()
    .messages({
      'date.base': 'La fecha de la asistencia debe ser una fecha válida',
      'any.required': 'La fecha de la asistencia es requerida'
    }),

  status: Joi
    .string()
    .valid(...ATTENDANCE_STATUSES)
    .required()
    .messages({
      'any.only': `El estado debe ser ${ATTENDANCE_STATUSES.join(', ')}`,
      'string.empty': 'El estado es requerido',
      'any.required': 'El estado es requerido'
    }),

  note: Joi
    .string()
    .trim()
    .min(5)
    .max(100)
    .messages({
      'string.min': 'La nota debe tener mínimo 5 caracteres',
      'string.max': 'La nota no puede tener más de 100 caracteres'
    })
    .allow('')
    .optional(),

  idStudent: Joi
    .string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'El ID del estudiante es requerido',
      'string.pattern.base': 'El ID del estudiante debe ser un número entero',
      'any.required': 'El ID del estudiante es requerido'
    }),
})

export { ValidationCreateAttendance }