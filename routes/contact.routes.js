module.exports = app => {
    const contacts = require("../controllers/contact.controller")

    const router = require("express").Router()

    // New Contact route
    router.post("/", contacts.createContact)

    // All user contact route
    router.get("/:id", contacts.contacts)

    // Update a contact route
    router.put("/:id", contacts.updateContact)

    // Delete a contact route
    router.delete("/:id", contacts.deleteContact)

    app.use("/api/contacts", router)
}