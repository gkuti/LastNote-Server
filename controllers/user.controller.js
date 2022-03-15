const db = require("../models")
const User = db.user

exports.saveUser = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        return res.status(400).send({message: "Body cannot be empty"})
    }

    const condition = {userId: {$eq: req.body.userId}}
    User.findOneAndUpdate(condition, req.body, {upsert: true})
        .then(data => {
            res.send({message: "User saved"})
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}