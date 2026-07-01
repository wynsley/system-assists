import Joi from "joi"

const ValidationLogin = Joi.object({
    email: Joi
    .string()
    .min(8)
    .max(100)
    .pattern(/^[a-zA-Z0-9._%+-áéíóúÁÉÍÓÚñÑ]+@(gmail\.com|hotmail\.com|yahoo\.com|system\.com)$/)
    .required()
    .messages({
      'string.base': 'El correo de ser una cadena de caracteres',
      'string.empty': 'El correo no puede estar vacio',
      'string.min': 'El correo debe contener minimo 8 caracteres',
      'string.max': 'El correo solo puede contener máximo 100 caracteres',
      'string.pattern.base': 'Ingrese un correo válido (gmail, hotmail, yahoo) (.com)',
      'any.required': 'El correo es requerido'
    }),
  password: Joi
    .string()
    .min(8)
    .max(35)
    .required()
    .pattern(/^(?=(.*[A-Z]))(?=(.*\d.*\d)).+$/)
    .messages({
      'string.base': 'La contraseña debe de ser una cadena de caracteres',
      'string.empty': 'La contraseña no puede estar vacia',
      'string.min': 'La contraseña debe contener minimo 8 caracteres',
      'string.max': 'La contraseña solo puede contener máximo 35 caracteres',
      'string.pattern.base': 'La contraseña debe contar con mínimo una letra mayuscula y dos números',
      'any.required': 'La contraseña es requerida'
    }),
})

export { ValidationLogin }