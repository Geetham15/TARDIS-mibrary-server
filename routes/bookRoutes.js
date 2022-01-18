import express from "express";

import { listBook, addBook } from "../controllers/controller.js";

const router = express.Router();

router.get("/bookList", listBook);

router.post("/addBook", addBook);

//export default router;
export default router;
