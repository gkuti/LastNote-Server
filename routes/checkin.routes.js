module.exports = app => {
    const checkin = require("../controllers/checkin.controller")

    const router = require("express").Router()

    // new Note route
    router.post("/frequency", checkin.checkin)

    app.use("/api/checkin", router)
}