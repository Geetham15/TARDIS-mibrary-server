const { BookShelves } = require("../models/bookShelves");

async function addBook(req, res) {
  console.log("Adding a Book");
  console.log(req.body);
  let newBook = await new BookShelves(req.body);
  let book = await newBook.save();
  res.send(book);
}

async function listBook(req, res) {
  let bookList = await BookShelves.find({});
  console.log(bookList);
  res.json(bookList);
}

module.exports = {
  addBook,
  listBook,
};
