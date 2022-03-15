module.exports = app => {
    const users = require("../controllers/user.controller")

    const router = require("express").Router()

    // new Note route
    router.post("/", users.saveUser)

    app.use("/api/user", router)
}