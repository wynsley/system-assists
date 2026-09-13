import { nonSchoolDayService } from "./nonSchoolDay.service.js";
import { nonSchoolDaySchema } from "./nonSchoolDay.schema.js";
import { validateUtils } from "../../utils/validate.utils.js";

const nonSchoolDayController = {
  create: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: nonSchoolDaySchema.create,
        data: req.body,
      });

      const nonSchoolDay = await nonSchoolDayService.create(validate);

      return res.json({
        success: true,
        message: "Día(s) no lectivo(s) registrado(s) correctamente",
        data: nonSchoolDay,
      });
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: nonSchoolDaySchema.params,
        data: req.query,
      });

      const [nonSchoolDays, total] = await nonSchoolDayService.get(validate);

      return res.json({
        success: true,
        data: nonSchoolDays,
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
      const { id: idNonSchoolDay } = await validateUtils.validateSchema({
        schema: nonSchoolDaySchema.params,
        data: req.params,
      });

      const nonSchoolDay = await nonSchoolDayService.getById({ idNonSchoolDay });

      return res.json({ success: true, data: nonSchoolDay });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id: idNonSchoolDay } = await validateUtils.validateSchema({
        schema: nonSchoolDaySchema.params,
        data: req.params,
      });

      const data = await validateUtils.validateSchema({
        schema: nonSchoolDaySchema.update,
        data: req.body,
      });

      const nonSchoolDay = await nonSchoolDayService.update({ idNonSchoolDay, data });

      return res.json({
        success: true,
        message: "Día no lectivo actualizado correctamente",
        data: nonSchoolDay,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id: idNonSchoolDay } = await validateUtils.validateSchema({
        schema: nonSchoolDaySchema.params,
        data: req.params,
      });

      const nonSchoolDay = await nonSchoolDayService.delete({ idNonSchoolDay });

      return res.json({
        success: true,
        message: "Día no lectivo eliminado correctamente",
        data: nonSchoolDay,
      });
    } catch (error) {
      next(error);
    }
  },
};

export { nonSchoolDayController };