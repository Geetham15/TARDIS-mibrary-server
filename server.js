const express = require('express')
const app = express()
const port = 3000

const bookRoutes = require ('./routes/bookRoutes')

app.use ('/api',bookRoutes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})