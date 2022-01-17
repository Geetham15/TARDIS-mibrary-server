const express = require("express")

const bookShelvesModel = require('../models/bookShelves')

const router = express.Router();

// router.get("/bookList", async (req, res) => {
//   let message =
//     "Hi Team TARDIS. If you see this message, the back end is connected to the front end.";
//   res.json(message);
// });

router.get("/bookList", async (req, res) => {
  let bookList = await bookShelvesModel.listBook()
  console.log(bookList)
  res.send(bookList)
});

//export default router;
module.exports = router
