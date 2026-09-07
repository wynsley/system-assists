import { academicPeriodService } from "./academicPeriod.service.js";
import { academicPeriodSchema } from "./academicPeriod.schema.js";
import { validateUtils } from "../../utils/validate.utils.js";

const academicPeriodController = {
  create: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({ schema: academicPeriodSchema.create, data: req.body });
      const period = await academicPeriodService.create(validate);
      return res.json({ success: true, message: "Bimestre creado correctamente", data: period });
    } catch (error) { next(error); }
  },

  get: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({ schema: academicPeriodSchema.params, data: req.query });
      const [periods, total] = await academicPeriodService.get(validate);
      return res.json({
        success: true,
        data: periods,
        pagination: { page: validate.page, limit: validate.limit, total, totalPages: Math.ceil(total / validate.limit) },
      });
    } catch (error) { next(error); }
  },

  getCurrent: async (req, res, next) => {
    try {
      const period = await academicPeriodService.getCurrent();
      return res.json({ success: true, data: period });
    } catch (error) { next(error); }
  },

  getById: async (req, res, next) => {
    try {
      const { id: idPeriod } = await validateUtils.validateSchema({ schema: academicPeriodSchema.params, data: req.params });
      const period = await academicPeriodService.getById({ idPeriod });
      return res.json({ success: true, data: period });
    } catch (error) { next(error); }
  },

  update: async (req, res, next) => {
    try {
      const { id: idPeriod } = await validateUtils.validateSchema({ schema: academicPeriodSchema.params, data: req.params });
      const data = await validateUtils.validateSchema({ schema: academicPeriodSchema.update, data: req.body });
      const period = await academicPeriodService.update({ idPeriod, data });
      return res.json({ success: true, message: "Bimestre actualizado correctamente", data: period });
    } catch (error) { next(error); }
  },

  delete: async (req, res, next) => {
    try {
      const { id: idPeriod } = await validateUtils.validateSchema({ schema: academicPeriodSchema.params, data: req.params });
      const period = await academicPeriodService.delete({ idPeriod });
      return res.json({ success: true, message: "Bimestre eliminado correctamente", data: period });
    } catch (error) { next(error); }
  },
};

export { academicPeriodController };