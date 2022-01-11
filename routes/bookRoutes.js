const express = require ('express')
const router = express.Router ()
router.get ("/bookList", async (req,res)=>{
    let message = "Hi Team TARDIS"
    res.send (message)
})

module.exports = router