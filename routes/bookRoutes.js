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
  updatePostalCode,
  bookOutOnLoan,
  getLentBooks,
  getBooksDueSoon,
  getBooksRented,
  getPendingRentals,
  updatePendingRental,
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

router.post("/bookOutOnLoan", auth, bookOutOnLoan);

router.post("/updatePostalCode", auth, updatePostalCode);

router.get("/getLentBooks/:id", auth, getLentBooks);

router.get("/getBooksDueSoon/:id", auth, getBooksDueSoon);

router.get("/getBooksRented/:id", auth, getBooksRented);

router.get("/getPendingRentals", auth, getPendingRentals);

router.post("/updatePendingRental", auth, updatePendingRental);

// chat routes

router.post("/sendChat", auth, sendChat);

router.get("/loadChats", auth, loadChats);

router.get("/loadUsers/:id", auth, loadUsers);

router.post("/deleteConversation", auth, deleteConversation);

//export default router;
export default router;
