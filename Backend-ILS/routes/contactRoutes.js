import express from "express";
import {
  createContact,
  getAllContacts,
} from "../controllers/contactController.js";
import { isAuthenticated, roleMiddleware } from "../middlewares/auth.js";


const router = express.Router();

router.post("/create", createContact);
router.get(
  "/get-all-contacts",
  isAuthenticated,
  roleMiddleware(["admin"]),
  getAllContacts
);



export default router;
