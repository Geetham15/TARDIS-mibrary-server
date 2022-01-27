import express from "express";

import {
  addBook,
  listBook,
  search,
  createUser,
  logIn,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/bookList", listBook);

router.get("/search/:title", search);

router.post("/addBook", addBook);

router.post("/createUser", createUser);

router.post("/logIn", logIn);

//export default router;
export default router;
