import BookShelves from "../models/bookShelves.js";

async function addBook(req, res) {
  console.log("Adding a Book");
  console.log(req.body);
  let newBook = await new BookShelves(req.body);
  let book = await newBook.save();
  res.send(book);
}

async function listBook(req, res) {
  let bookList = await BookShelves.find({});
  res.json(bookList);
}

async function search(req, res) {
  let result = await BookShelves.findOne({
    title: { $regex: new RegExp("^" + req.params.title + "$", "i") },
  });
  console.log(result);
  res.json(result);
}

export { addBook, listBook, search };
