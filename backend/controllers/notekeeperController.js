const { mongo } = require("mongoose");
const notesModel = require("../models/noteKeeperModel");
const mongoose = require("mongoose");
const userModel = require("../models/userAuthModel");

exports.createNotes = async (req, res) => {
    try {
        const { title, description } = req.body
        const userId = req.user.id
        // console.log(title,description,userId);

        if (!userId || !req.user) {
            return res.status(400).json({ success: false, message: "Unauthorized user" })
        }

        if (!title || !description) {
            return res.status(400).json({ sucess: false, message: "All fileds are required" })
        }

        const userNotes = new notesModel({
            userId: userId,
            title,
            description
        })

        await userNotes.save()

        res.status(201).json({ success: true, message: "Note created successfully", userNotes })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.getSingleNote = async (req, res) => {
    try {
        const userId = req.user.id
        const { noteId } = req.params

        // console.log(userId, noteId);
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ success: true, message: "Inavalid note ID" })
        }

        if (!userId || !req.user) {
            return res.status(200).json({ sucess: false, message: "Unauthorized user" })
        }

        const note = await notesModel.findById({ _id: noteId })

        if (!note) {
            return res.status(400).json({ success: false, message: "Notes not found" })
        }

        return res.status(200).json({ success: true, message: "Single note fetched successfully", note })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.updateNote = async(req,res) => {
    try {
        const {title,description} = req.body
        const {noteId} = req.params

        if(!req.user.id){
            return res.status(401).json({success:false,message:"Unauthorized user"})
        }

        if(!mongoose.Types.ObjectId.isValid(noteId)){
            return res.status(400).json({success:false,message:"Invalid note ID"})
        }

        if(!title || !description){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        const updatedNote = await notesModel.findByIdAndUpdate({_id:noteId} , {$set:{title , description}})

        if(!updatedNote){
            return res.status(404).json({success:false,message:"Note not found"})
        }

        return res.status(200).json({success:true,message:"Note successfully updated" , updatedNote})
    } catch (error) {
        console.log(error);
        res.status(500).json({sucess:false,message:"Internal server error"})
    }
}

exports.deleteNote = async(req,res) => {
    try {
        const {noteId} = req.params

        if(!req.user || !req.user.id){
            return res.status(401).json({success:false,message:"Unauthorized user"})
        }

        if(!mongoose.Types.ObjectId.isValid(noteId)){
            return res.status(400).json({success:false,message:"Invalid note ID"})
        }

        const deletedNote = await notesModel.findByIdAndDelete({_id:noteId})

        if(!deletedNote){
            return res.status(400).json({success:false,message:"Note not found or already deleted"})
        }

        return res.status(200).json({success:true, message:"Note deleted successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false , message:"Internal server error"})
    }
}

exports.getAllNotes = async(req,res) => {
    try {
        const userId = req.user.id
        // console.log(userId);
        console.log(req.query);

        if(!userId || !req.user){
            return res.status(401).json({success:false , message:"Unauthorized user"})
        }

        const allNotes = await notesModel.find({userId})

        return res.status(200).json({success:true,message:"fetched all notes" , allNotes})

    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}

