import Joi from "joi"

const ValidationChangePassword = Joi.object({
  oldPassword: Joi
    .string()
    .trim()
    .min(8)
    .max(32)
    .pattern(/^\S+$/)
    .required()
    .messages({
      'string.empty': 'La contraseña actual no puede estar vacía',
      'string.min': 'La contraseña actual debe tener mínimo 8 caracteres',
      'string.max': 'La contraseña actual no puede tener más de 32 caracteres',
      'string.pattern.base': 'La contraseña actual no puede contener espacios',
      'any.required': 'La contraseña actual es requerida'
    }),

  password: Joi
    .string()
    .trim()
    .min(8)
    .max(32)
    .pattern(/^\S+$/)
    .pattern(/[a-zA-Z]/)
    .pattern(/[0-9]/)
    .invalid(Joi.ref('oldPassword'))
    .required()
    .messages({
      'string.empty': 'La nueva contraseña no puede estar vacía',
      'string.min': 'La nueva contraseña debe tener mínimo 8 caracteres',
      'string.max': 'La nueva contraseña no puede tener más de 32 caracteres',
      'any.required': 'La nueva contraseña es requerida',
      'any.invalid': 'La nueva contraseña no puede ser igual a la actual'
    })
    .pattern(/^\S+$/, { name: 'spaces' })
    .pattern(/[a-zA-Z]/, { name: 'letter' })
    .pattern(/[0-9]/, { name: 'number' })
    .messages({
      'string.pattern.name.spaces': 'La nueva contraseña no puede contener espacios',
      'string.pattern.name.letter': 'La nueva contraseña debe contener al menos una letra',
      'string.pattern.name.number': 'La nueva contraseña debe contener al menos un número'
    }),

  repassword: Joi
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'La confirmación de la contraseña es requerida'
    })
})

export { ValidationChangePassword }