const express = require('express')
const router = express.Router()

//Getting All Users
router.get('/', (req, res) => {
    res.send('Getting All was called')
})
//Getting One User

//:id stands for paramer and can by accessed by req.params
router.get('/:id', (req, res) => {
    res.send(req.params.id)
})
//Creating One User
router.post('/', (req, res) => {
    req.params.id
})

//Updating One User
//Patch instead of Put because only the provided fields should be updated not the whole user
router.patch('/:id', (req, res) => {
    req.params.id
})

//Deleting One User
router.delete('/:id', (req, res) => {
    req.params.id
})


module.exports = router