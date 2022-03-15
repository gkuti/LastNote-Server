const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = "mongodb://127.0.0.1:27017/LastNote"
db.notes = require("./note.model")(mongoose)
db.contacts = require("./contact.model")(mongoose)
db.user = require("./user.model")(mongoose)
// db.tutorials = require("./note.model")(mongoose)

module.exports = db