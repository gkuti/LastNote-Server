const db = require("../models")
const Checkin = db.checkin
const {add} = require('date-fns/add')

exports.checkinFrequency = (req, res) => {
    // Validate request
    if (!req.body.userId) {
        return res.status(400).send({message: "Body cannot be empty"})
    }

    const condition = {userId: {$eq: req.body.userId}}
    Checkin.findOneAndUpdate(condition, req.body, {returnDocument: "after"})
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.getCheckin = (req, res) => {
    const condition = {userId: {$eq: req.params.id}}

    Checkin.findOne(condition)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.checkin = (req, res) => {
    const condition = {userId: {$eq: req.params.id}}

    Checkin.find(condition)
        .then(data => {
            let date
            if (data.nextCheckin === "5minutes") {
                date = add(new Date(), {minutes: 5})
            } else if (data.nextCheckin === "daily") {
                date = add(new Date(), {days: 1})
            } else if (data.nextCheckin === "weekly") {
                date = add(new Date(), {weeks: 1})
            } else if (data.nextCheckin === "monthly") {
                date = add(new Date(), {months: 1})
            } else if (data.nextCheckin === "6months") {
                date = add(new Date(), {months: 6})
            }
            Checkin.findByIdAndUpdate(data.id, {nextCheckin: date.getTime()})
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}