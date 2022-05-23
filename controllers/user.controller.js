const db = require("../models")
const User = db.user
const Checkin = db.checkin

exports.saveUser = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        return res.status(400).send({message: "Body cannot be empty"})
    }

    // Find the user account and update it with the new record with user push token ID
    // If the user record doesn't exist, a new record is created in the users document and
    // a checkin record is created in the checkin document.
    const condition = {userId: {$eq: req.body.userId}}
    User.findOneAndUpdate(condition, req.body, {upsert: true, returnDocument: "before"})
        .then(data => {
            console.log(data == null)
            if (data != null) return res.send({message: "User saved"})
            const today = new Date();
            const tomorrow = new Date();

            //Default checkin frequency is daily
            tomorrow.setUTCDate(today.getDate() + 1);
            const checkin = new Checkin({
                userId: req.body.userId,
                checkinFrequency: "daily",
                currentCheckinPhase: 1,
                checkin: false,
                nextCheckin: tomorrow.getTime(),
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
}