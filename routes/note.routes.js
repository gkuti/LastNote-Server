module.exports = app => {
    const notes = require("../controllers/note.controller")

    const router = require("express").Router()

    // New note route
    router.post("/", notes.createNote)

    // All user notes route
    router.get("/:id", notes.notes)

    // Update a note route
    router.put("/:id", notes.updateNote)

    // Delete a note route
    router.delete("/:id", notes.deleteNote)

    app.use("/api/notes", router)
}