const checkin = require("../controllers/checkin.controller");
module.exports = app => {
    const checkin = require("../controllers/checkin.controller")

    const router = require("express").Router()

    // Update checkin frequency route
    router.put("/frequency", checkin.checkinFrequency)

    // Get checkin route
    router.get("/:id", checkin.getCheckin)

    // User checkin route
    router.put("/:id", checkin.checkin)

    app.use("/api/checkin", router)
}