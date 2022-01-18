import express from "express";

import { listBook, addBook, search } from "../controllers/controller.js";

const router = express.Router();

router.get("/bookList", listBook);

router.get("/search/:title", search);

router.post("/addBook", addBook);

//export default router;
export default router;
