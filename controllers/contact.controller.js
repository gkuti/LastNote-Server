const db = require("../models")
const Contact = db.contacts

exports.createContact = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        return res.status(400).send({message: "Contact cannot be empty"})
    }

    const contact = new Contact({
        userId: req.body.userId,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhones: req.body.contactPhones,
    })

    contact
        .save(contact)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.contacts = (req, res) => {
    if (!req.body.userId) {
        return res.status(400).send({message: "Missing userId"})
    }
    const condition = {userId: {$eq: req.body.userId}}

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
    if (!req.body.userId) {
        return res.status(400).send({
            message: "Contact cannot be empty"
        })
    }

    const id = req.params.id

    Contact.findByIdAndUpdate(id, req.body)
        .then(data => {
            res.send({message: "Contact updated"})
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