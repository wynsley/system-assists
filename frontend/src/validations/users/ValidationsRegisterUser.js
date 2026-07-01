import Joi from "joi"

const ValidateRegisterUser = Joi.object({
  firstname: Joi
    .string()
    .trim()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener mínimo 2 caracteres',
      'string.max': 'El nombre no puede tener más de 50 caracteres',
      'string.pattern.base': 'El nombre solo puede contener letras y espacios',
      'any.required': 'El nombre es requerido'
    }),

  lastname: Joi 
    .string()
    .trim()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'El apellido debe ser una cadena de texto',
      'string.empty': 'El apellido no puede estar vacío',
      'string.min': 'El apellido debe tener mínimo 2 caracteres',
      'string.max': 'El apellido no puede tener más de 50 caracteres',
      'string.pattern.base': 'El apellido solo puede contener letras y espacios',
      'any.required': 'El apellido es requerido'
    }),

  email: Joi
    .string()
    .trim()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.base': 'El correo debe ser un texto',
      'string.empty': 'El correo es requerido',
      'string.email': 'El correo no tiene un formato válido',
      'any.required': 'El correo es requerido'
    }),

  password: Joi
    .string()
    .trim()
    .min(8)
    .max(32)
    .pattern(/^\S+$/)
    .pattern(/[a-zA-Z]/, { name: 'letter' })
    .pattern(/[0-9]/, { name: 'number' })
    .required()
    .messages({
      'string.empty': 'La contraseña no puede estar vacía',
      'string.min': 'La contraseña debe tener mínimo 8 caracteres',
      'string.max': 'La contraseña no puede tener más de 32 caracteres',
      'string.pattern.base': 'La contraseña no puede contener espacios',
      'string.pattern.name.letter': 'La contraseña debe contener al menos una letra',
      'string.pattern.name.number': 'La contraseña debe contener al menos un número',
      'any.required': 'La contraseña es requerida'
    }),

  repassword: Joi
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'La confirmación de la contraseña es requerida'
    }),

  role: Joi
    .string()
    .valid('ADMIN', 'AUXILIAR', 'PARENT')
    .required()
    .messages({
      'any.only': 'El rol debe ser ADMIN, AUXILIAR o PARENT',
      'string.empty': 'El rol es requerido',
      'any.required': 'El rol es requerido'
    }),

  phone: Joi
    .string()
    .trim()
    .custom((value) => value.replace(/\s+/g, ""))
    .pattern(/^\+51\d{9}$/)
    .required()
    .messages({
      'string.base': 'El teléfono debe ser una cadena de caracteres',
      'string.empty': 'El teléfono no puede estar vacío',
      'string.pattern.base': 'El teléfono debe tener formato +51 9XX XXX XXX',
      'any.required': 'El teléfono es requerido'
    }),
})

export { ValidateRegisterUser }