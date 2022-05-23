const db = require("../models")
const Checkin = db.checkin
const add = require('date-fns/add')
const {getNextCheckinDate} = require("../utils/Util");

//Update checkin Frequency
exports.checkinFrequency = (req, res) => {
    // Validate request body
    if (!req.body.userId) {
        return res.status(400).send({message: "Body cannot be empty"})
    }

    const condition = {userId: {$eq: req.body.userId}}
    const date = getNextCheckinDate(req.body.checkinFrequency)
    //find user current checkin record and update the frequency
    Checkin.findOneAndUpdate(condition, {
        nextCheckin: date.getTime(),
        checkinFrequency: req.body.checkinFrequency
    }, {returnDocument: "after"})
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

//Get user checkin
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

//User Checkin
exports.checkin = (req, res) => {
    const condition = {userId: {$eq: req.params.id}}

    //we need to find current user record and get the checkinFrequency to we can create the next checkin using the interval
    Checkin.findOne(condition)
        .then(data => {
            const cDate = new Date()
            //obtain next checkin
            const date = getNextCheckinDate(data.checkinFrequency)
            console.log(cDate)
            console.log(date)
            Checkin.findByIdAndUpdate(data.id, {nextCheckin: date.getTime(), currentCheckinPhase: 1}).then(value => {
                res.send(value)
            }).catch(err => {
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