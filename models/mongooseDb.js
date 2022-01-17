const mongoose = require('mongoose')

const dbUrl = 'mongodb://localhost:27017/mibrary'
mongoose.connect(dbUrl)

module.exports = mongoose