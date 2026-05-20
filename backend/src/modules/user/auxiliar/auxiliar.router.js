import { Router } from "express";
import { auxiliarController } from "./auxiliar.controller.js";

const auxiliarRouter = Router();

auxiliarRouter.route("/").post(auxiliarController.createAuxiliar);

export { auxiliarRouter };
