const express = require('express')
const app = express()
app.use(express.json())
const db = require("./models");
const Cron = require("croner");
const {checkin} = require("./message/Checkin");
db.mongoose.connect(db.url)
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

require("./routes/note.routes")(app);
require("./routes/contact.routes")(app);
require("./routes/user.routes")(app);
require("./routes/checkin.routes")(app);

app.listen(3000, function () {
    console.log('listening on 3000')
})

//Cron job, runs checkin function every 10 secs
const job = Cron('*/10 * * * * *', () => {
    checkin()
});