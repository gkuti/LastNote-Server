const db = require("../models")
const Contact = db.contacts

exports.createContact = (req, res) => {
    // Validate request body
    if (!req.body.userId) {
        return res.status(400).send({message: "Contact cannot be empty"})
    }

    const contact = new Contact({
        userId: req.body.userId,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
    })

    contact
        .save(contact)
        .then(data => {
            console.log(data)
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.contacts = (req, res) => {
    const condition = {userId: {$eq: req.params.id}}

    Contact.find(condition)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.updateContact = (req, res) => {
    if (!req.body.contactName) {
        return res.status(400).send({
            message: "Contact cannot be empty"
        })
    }

    const id = req.params.id

    Contact.findByIdAndUpdate(id, req.body, {returnDocument: "after"})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.deleteContact = (req, res) => {
    const id = req.params.id

    Contact.findByIdAndRemove(id)
        .then(data => {
            res.send({
                message: "Contact deleted"
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err
            })
        })
}