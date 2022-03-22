const db = require("../models")
const User = db.user
const Checkin = db.checkin

exports.saveUser = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        return res.status(400).send({message: "Body cannot be empty"})
    }

    const condition = {userId: {$eq: req.body.userId}}
    let createCheckIn
    User.findOne(condition)
        .then(data => {
            createCheckIn = data == null
            console.log(data)
            console.log(createCheckIn)
            User.findOneAndUpdate(condition, req.body, {upsert: true})
                .then(user => {
                    if (!createCheckIn) return res.send({message: "User saved"})
                    const today = new Date();
                    const tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);
                    const checkin = new Checkin({
                        userId: req.body.userId,
                        checkinFrequency: "daily",
                        currentCheckinPhase: "one",
                        nextCheckin: tomorrow.toISOString(),
                    })
                    checkin.save(checkin)
                        .then(data => {
                            res.send({message: "User saved"})
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message
                            })
                        })
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    })
                })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}