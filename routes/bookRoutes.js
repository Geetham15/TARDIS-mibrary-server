const express = require("express");

const { listBook, addBook } = require("../controllers/controller");

const router = express.Router();

router.get("/bookList", listBook);

router.post("/addBook", addBook);

//export default router;
module.exports = router;
