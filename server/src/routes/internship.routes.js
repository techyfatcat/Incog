import express from "express";

import {
    getInternships,
    seedInternships
} from "../controllers/internshipController.js";

const router = express.Router();


// GET all internships
router.get("/", getInternships);


// run once to insert sample data
router.get("/seed", seedInternships);


export default router;