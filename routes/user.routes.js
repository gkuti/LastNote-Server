module.exports = app => {
    const users = require("../controllers/user.controller")

    const router = require("express").Router()

    // Save user route
    router.post("/", users.saveUser)

    app.use("/api/user", router)
}