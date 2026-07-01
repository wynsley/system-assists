import Joi from "joi"

const ValidationUpdateUser = Joi.object({
  firstname: Joi
    .string()
    .trim()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .messages({
      'string.min': 'El nombre debe tener mínimo 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios'
    })
    .optional(),

  lastname: Joi
    .string()
    .trim()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .messages({
      'string.min': 'El apellido debe tener mínimo 2 caracteres',
      'string.max': 'El apellido no puede tener más de 50 caracteres',
      'string.pattern.base': 'El apellido solo puede contener letras y espacios'
    })
    .optional(),

  email: Joi
    .string()
    .trim()
    .email()
    .lowercase()
    .messages({
      'string.email': 'El correo no tiene un formato válido'
    })
    .optional(),

  role: Joi
    .string()
    .valid('ADMIN', 'AUXILIAR', 'PARENT')
    .messages({
      'any.only': 'El rol debe ser ADMIN, AUXILIAR o PARENT'
    })
    .optional(),

  phone: Joi
    .string()
    .trim()
    .custom((value) => value.replace(/\s+/g, ""))
    .pattern(/^\+51\d{9}$/)
    .messages({
      'string.pattern.base': 'El teléfono debe tener formato +51 9XX XXX XXX'
    })
    .optional(),

  password: Joi
    .string()
    .trim()
    .min(8)
    .max(32)
    .pattern(/^\S+$/)
    .pattern(/[a-zA-Z]/, { name: 'letter' })
    .pattern(/[0-9]/, { name: 'number' })
    .messages({
      'string.min': 'La contraseña debe tener mínimo 8 caracteres',
      'string.max': 'La contraseña no puede tener más de 32 caracteres',
      'string.pattern.base': 'La contraseña no puede contener espacios',
      'string.pattern.name.letter': 'La contraseña debe contener al menos una letra',
      'string.pattern.name.number': 'La contraseña debe contener al menos un número'
    })
    .optional()
    .allow(''),

  repassword: Joi
    .string()
    .trim()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Las contraseñas no coinciden'
    })
    .optional()
    .allow(''),
})

export { ValidationUpdateUser }