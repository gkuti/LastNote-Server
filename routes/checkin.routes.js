const checkin = require("../controllers/checkin.controller");
module.exports = app => {
    const checkin = require("../controllers/checkin.controller")

    const router = require("express").Router()

    // new Note route
    router.put("/frequency", checkin.checkinFrequency)

    // new Note route
    router.get("/:id", checkin.getCheckin)

    // new Note route
    router.put("/:id", checkin.checkin)

    app.use("/api/checkin", router)
}