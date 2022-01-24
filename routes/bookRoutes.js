import express from "express";

import { addBook, listBook } from "../controllers/controller.js";

const router = express.Router();

router.get("/bookList", listBook);

//router.get("/search/:title", search);

router.post("/addBook", addBook);

//export default router;
export default router;
