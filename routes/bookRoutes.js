import express from "express";
import auth from "../middleware/auth.js";
import {
  addBook,
  listBook,
  search,
  createUser,
  logIn,
  listBooksByUserId,
  deleteBookById,
  logOut,
  isLoggedIn,
} from "../controllers/controller.js";
import {
  sendChat,
  loadChats,
  loadUsers,
  deleteConversation,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/bookList", auth, listBook);

router.get("/userBooks/:id", auth, listBooksByUserId);

router.get("/search/:title", auth, search);

router.post("/addBook", auth, addBook);

router.post("/deleteBook", auth, deleteBookById);

router.post("/createUser", createUser);

router.post("/logIn", logIn);

router.get("/logOut", auth, logOut);

router.get("/loggedIn", isLoggedIn);

// chat routes

router.post("/sendChat", auth, sendChat);

router.get("/loadChats", auth, loadChats);

router.get("/loadUsers/:id", auth, loadUsers);

router.post("/deleteConversation", deleteConversation);

//export default router;
export default router;
