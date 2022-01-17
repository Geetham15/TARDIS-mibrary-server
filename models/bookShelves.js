const mongoose = require('./mongooseDb')

const BookShelves = mongoose.model('BookShelves',
{
    "title" : String,
    "description" : String,
    "author" : String,
    "isbnNumber": String,
    "binding" : String,
    "publisher" : String,
    "published" : String,
    "condition" : String,
    "notes" : String,
    "comments" : String
})


async function addBook(bookShelvesData) {
    console.log('Adding a Book')
    let newBook = new BookShelves(bookShelvesData)
    let book = await newBook.save()
    return book.id
}

async function listBook(){
    return BookShelves.find({})
}

module.exports = {
    addBook,
    listBook
}