const db = require("../models")
const Note = db.notes

exports.createNote = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        return res.status(400).send({message: "Note cannot be empty"})
    }

    const note = new Note({
        userId: req.body.userId,
        noteTitle: req.body.noteTitle,
        note: req.body.note,
        additionalComment: req.body.additionalComment,
    })

    note
        .save(note)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.notes = (req, res) => {
    const condition = {userId: {$eq: req.params.id}}

    Note.find(condition)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.updateNote = (req, res) => {
    if (!req.body.note) {
        return res.status(400).send({
            message: "Note cannot be empty"
        })
    }

    const id = req.params.id

    Note.findByIdAndUpdate(id, req.body, {returnDocument:"after"})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.deleteNote = (req, res) => {
    const id = req.params.id

    Note.findByIdAndRemove(id)
        .then(data => {
            res.send({
                message: "Note deleted"
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err
            })
        })
}