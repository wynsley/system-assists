import { behaviorService } from "./behavior.service.js";
import { behaviorSchema } from "./behavior.schema.js";
import { validateUtils } from "../../utils/validate.utils.js";

const behaviorController = {
  getRoster: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: behaviorSchema.params,
        data: req.query,
      });

      const user = req.user;
      const idAuxiliar = user?.role === "AUXILIAR" ? user.sub : undefined;

      const { students, total, period } = await behaviorService.getRoster({
        ...validate,
        idAuxiliar,
      });

      return res.json({
        success: true,
        data: students,
        period,
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

  calificar: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: behaviorSchema.calificar,
        data: req.body,
      });

      const idAuxiliar = req.user.sub;

      const result = await behaviorService.calificar({ ...validate, idAuxiliar });

      return res.json({
        success: true,
        message: "Nota registrada correctamente",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getConsolidado: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: behaviorSchema.params,
        data: req.query,
      });

      const user = req.user;
      const idAuxiliar = user?.role === "AUXILIAR" ? user.sub : undefined;

      const {students, period } = await behaviorService.getConsolidado({ ...validate, idAuxiliar });

      return res.json({ success: true, data: students, period });
    } catch (error) {
      next(error);
    }
  },
};

export { behaviorController };