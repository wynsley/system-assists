import { AppError } from "../../../utils/AppError.js";
import { userSchema } from "../user.schema.js";
import { userService } from "../user.service.js";
import { generatePasswordHash } from "../../../utils/auth.utils.js";

const auxiliarController = {
  createAuxiliar: async (req, res, next) => {
    try {
      const { firstname, lastname, email, password, repassword } = req.body;
      const validate = await userSchema.safeParseAsync({
        firstname,
        lastname,
        email,
        password,
        repassword,
        role: 'AUXILIAR'
      });

      if(!validate.success) throw new AppError(
        "Error de validación",
        400,
        validate.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message
        }))
      )

      const passwordHash = await generatePasswordHash(password)

      const queryResult = await userService.createUser({ firstname, lastname, email, passwordHash })

      return res.json(queryResult.user)
    } catch (error) {
      next(error)
    }
  },

  // TODO: update, delete, getAll, getById
}

export { auxiliarController }