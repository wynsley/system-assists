import Joi from "joi"

const ValidationCreateIncident = Joi.object({
  date: Joi
    .date()
    .required()
    .messages({
      'date.base': 'La fecha del incidente debe ser una fecha válida',
      'any.required': 'La fecha del incidente es requerida'
    }),

  note: Joi
    .string()
    .trim()
    .min(3)
    .max(255)
    .messages({
      'string.min': 'La nota del incidente debe tener mínimo 3 caracteres',
      'string.max': 'La nota del incidente no puede tener más de 255 caracteres'
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

  idAuxiliar: Joi
    .string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'El ID del auxiliar es requerido',
      'string.pattern.base': 'El ID del auxiliar debe ser un número entero',
      'any.required': 'El ID del auxiliar es requerido'
    }),

  idIncidentCatalog: Joi
    .string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'El ID del catálogo de incidentes es requerido',
      'string.pattern.base': 'El ID del catálogo de incidentes debe ser un número entero',
      'any.required': 'El ID del catálogo de incidentes es requerido'
    }),
})

export { ValidationCreateIncident }