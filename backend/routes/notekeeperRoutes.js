const express = require("express")
const { createNotes, getSingleNote, updateNote, deleteNote, getAllNotes } = require("../controllers/notekeeperController")
const verifyToken = require("../middlware/authMiddleware")


const router = express.Router()

router.post('/notes' ,verifyToken, createNotes)
router.get('/notes/:noteId' , verifyToken , getSingleNote)
router.put('/notes/:noteId' , verifyToken ,updateNote)
router.delete('/notes/:noteId' , verifyToken , deleteNote)
router.get('/notes' , verifyToken , getAllNotes)

module.exports = router