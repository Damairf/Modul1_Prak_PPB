import express from "express";
import { MedicationController } from "../controllers/medicationController.js";

const router = express.Router();

router.get("/", MedicationController.getAll);
router.get("/:id", MedicationController.getById);
router.get("/reports/total", MedicationController.getTotal);
router.post("/", MedicationController.create);
router.put("/:id", MedicationController.update);
router.delete("/:id", MedicationController.remove);

export default router;