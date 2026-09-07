import { incidentService } from "./incident.service.js";
import { incidentSchema } from "./incident.schema.js";
import { validateUtils } from "../../utils/validate.utils.js";

const incidentController = {
  create: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: incidentSchema.create,
        data: req.body,
      });

      const idAuxiliar = req.user.sub;

      const queryResult = await incidentService.create({ ...validate, idAuxiliar });

      return res.json({
        success: true,
        message: "Incidente registrado correctamente",
        incident: queryResult,
      });
    } catch (error) {
      next(error);
    }
  },

  get: async (req, res, next) => {
    try {
      const validate = await validateUtils.validateSchema({
        schema: incidentSchema.params,
        data: req.query,
      });
      const [incidents, total] = await incidentService.get(validate);

      return res.json({
        success: true,
        data: incidents,
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
      const { id: idIncident } = await validateUtils.validateSchema({
        schema: incidentSchema.params,
        data: req.params,
      });

      const queryResult = await incidentService.getById({ idIncident });

      return res.json({
        success: true,
        message: "Incidente encontrado",
        data: queryResult,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id: idIncident } = await validateUtils.validateSchema({
        schema: incidentSchema.params,
        data: req.params,
      });

      const data = await validateUtils.validateSchema({
        schema: incidentSchema.update,
        data: req.body,
      });

      const updatedIncident = await incidentService.update({
        idIncident,
        data,
      });

      return res.json({
        success: true,
        message: "Incidente actualizado correctamente",
        incident: updatedIncident,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id: idIncident } = await validateUtils.validateSchema({
        schema: incidentSchema.params,
        data: req.params,
      });

      const deletedIncident = await incidentService.delete({ idIncident });

      return res.json({
        success: true,
        message: "Incidente eliminado correctamente",
        incident: deletedIncident,
      });
    } catch (error) {
      next(error);
    }
  },
};

export { incidentController };
