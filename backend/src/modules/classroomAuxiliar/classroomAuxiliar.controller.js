import { classroomAuxiliarService } from "./classroomAuxiliar.service.js";
import { classroomAuxiliarSchema } from "./classroomAuxiliar.schema.js";
import { validateUtils } from "../../utils/validate.utils.js";

const classroomAuxiliarController = {
  create: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomAuxiliarSchema.create,
        data: req.body,
      });
      const queryResult = await classroomAuxiliarService.create(validate);

      return res.json({
        success: true,
        message: "Auxiliar asignado correctamente",
        data: queryResult,
      });
    } catch (error) {
      next(error);
    }
  },

  createByGrade: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomAuxiliarSchema.createByGrade,
        data: req.body,
      });
      const queryResult =
        await classroomAuxiliarService.createByGrade(validate);

      return res.json({
        success: true,
        message: "Auxiliar asignado correctamente",
        data: queryResult,
      });
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomAuxiliarSchema.params,
        data: req.query,
      });
      const user = req.user;
      if (user.role === "AUXILIAR") {
        validate.idAuxiliar = user.sub;
      }
      const [classroomAuxiliar, total] =
        await classroomAuxiliarService.get(validate);
      return res.json({
        success: true,
        message: "Lista de auxiliares obtenida correctamente",
        data: classroomAuxiliar,
        pagination: {
          page: validate.page,
          limit: validate.limit,
          total,
          totalPages: Math.ceil(total / validate.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomAuxiliarSchema.params,
        data: req.params,
      });
      const queryResult = await classroomAuxiliarService.getById({
        idClassroomAuxiliar: validate.id,
      });

      return res.json({
        success: true,
        message: "Auxiliar obtenido correctamente",
        data: queryResult,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const validateParams = await validateUtils.validateSchema({
        schema: classroomAuxiliarSchema.params,
        data: req.params,
      });
      const validateBody = await validateUtils.validateSchema({
        schema: classroomAuxiliarSchema.update,
        data: req.body,
      });
      const queryResult = await classroomAuxiliarService.update({
        idClassroomAuxiliar: validateParams.id,
        data: validateBody,
      });

      return res.json({
        success: true,
        message: "Auxiliar actualizado correctamente",
        data: queryResult,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: classroomAuxiliarSchema.params,
        data: req.params,
      });
      const deleteResult = await classroomAuxiliarService.delete({
        idClassroomAuxiliar: validate.id,
      });

      return res.json({
        success: true,
        message: "Auxiliar eliminado correctamente",
        data: { ...deleteResult },
      });
    } catch (error) {
      next(error);
    }
  },
};

export { classroomAuxiliarController };
