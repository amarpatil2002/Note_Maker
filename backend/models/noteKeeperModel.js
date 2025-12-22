const mongoose = require("mongoose")

const notesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })

const notesModel = mongoose.model("Notes", notesSchema)

module.exports = notesModel