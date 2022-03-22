const db = require("../models")
const Checkin = db.checkin

exports.checkin = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        return res.status(400).send({message: "Body cannot be empty"})
    }

    const condition = {userId: {$eq: req.body.userId}}
    Checkin.findOneAndUpdate(condition, req.body)
        .then(data => {
            res.send({message: "Checkin saved"})
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}