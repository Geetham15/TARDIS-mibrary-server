let bookShelvesList = require('./bookShelvesList.json')
let bookShelvesModel = require('../models/bookShelves')

bookShelvesList.forEach(async (book) => {
    console.log('Creating book list')
    let bookId = await bookShelvesModel.addBook(book)
    console.log('Added book with id', bookId)
})