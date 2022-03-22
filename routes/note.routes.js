module.exports = app => {
    const notes = require("../controllers/note.controller")

    const router = require("express").Router()

    // new Note route
    router.post("/", notes.createNote)

    // all Notes route
    router.get("/:id", notes.notes)

    // update a Note route
    router.put("/:id", notes.updateNote)

    // delete a Note route
    router.delete("/:id", notes.deleteNote)

    app.use("/api/notes", router)
}