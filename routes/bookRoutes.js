import express from "express";

import {
  addBook,
  listBook,
  search,
  createUser,
  logIn,
  listBooksByUserId,
  deleteBookById,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/bookList", listBook);

router.get("/userBooks/:id", listBooksByUserId);

router.get("/search/:title", search);

router.post("/addBook", addBook);

router.post("/deleteBook", deleteBookById);

router.post("/createUser", createUser);

router.post("/logIn", logIn);

//export default router;
export default router;
