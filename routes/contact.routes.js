module.exports = app => {
    const contacts = require("../controllers/contact.controller")

    const router = require("express").Router()

    // new Contact route
    router.post("/", contacts.createContact)

    // all Contact route
    router.get("/:id", contacts.contacts)

    // update a Contact route
    router.put("/:id", contacts.updateContact)

    // delete a Contact route
    router.delete("/:id", contacts.deleteContact)

    app.use("/api/contacts", router)
}