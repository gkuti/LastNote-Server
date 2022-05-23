const db = require("../models");
const {Expo} = require("expo-server-sdk");
const add = require("date-fns/add");
const Checkin = db.checkin
const User = db.user
const {getNextCheckinDate} = require("../utils/Util");
const nodemailer = require("nodemailer");
const Contacts = db.contacts
const Notes = db.notes

//Check all users record where nextCheckin is less than current time
exports.checkin = () => {
    const currentTime = new Date().getTime()
    Checkin.find({nextCheckin: {$lt: currentTime}}).then(data => {
        console.log("Users to check in: " + data.length)
        if (data.length > 0) {
            sendNotification(data)
        }
    }).catch(reason => {
        console.log(reason)
    })
}

//Perform user notification ie: send notifications or send user data to contacts depending on checkin phase
async function sendNotification(checkins) {
    let users = []
    for (const checkin of checkins) {
        if (!await notifyUser(checkin.userId)) {
            console.log("User: " + checkin.userId + " has incomplete details, skipping checkin")
            continue
        }

        //Check if current checkin phase as exceeded the maximum, send user data if true
        if (checkin.currentCheckinPhase > 3) {
            sendNotes(checkin.userId)
            return
        }

        //If user is still in valid checkin phase ie <=3 prepare push notifications
        const date = getNextCheckinDate(checkin.checkinFrequency)
        const checkinUpdate = await Checkin.findByIdAndUpdate(checkin.id, {
            currentCheckinPhase: checkin.currentCheckinPhase + 1,
            nextCheckin: date.getTime()
        }).exec()
        const condition = {userId: {$eq: checkin.userId}}
        const result = await User.findOne(condition).exec()
        users.push(result)
        console.log(checkin)
    }
    let expo = new Expo()

// Create the notifications for clients
    let messages = [];
    for (let user of users) {
        messages.push({
            to: user.pushToken,
            title: 'LastNote',
            body: 'Tap to Checkin',
            data: {userId: user.userId},
        })
    }

    //Send notifications
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
}

//Checkin if user should be notified using their contacts and notes record
async function notifyUser(userId) {
    const condition = {userId: {$eq: userId}}
    const contacts = await Contacts.find(condition).exec()
    const notes = await Notes.find(condition).exec()
    return !(contacts.length < 1 || notes.length < 1);
}


//Send user notes to contacts
async function sendNotes(userId) {
    const condition = {userId: {$eq: userId}}
    const contacts = (await Contacts.find(condition).exec()).map((value) => {
        return value.contactEmail
    })
    const notes = await Notes.find(condition).exec()

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'Last Note Team',
        to: contacts.join(),
        subject: "Confidential!",
        html: makeNote(notes),
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    clearUserData(userId)
}


//Create email body using the notes
function makeNote(notes) {
    let emailContent = "One of our users has you as a contact on Last Note service, and they have not been able to " +
        "check in with us after a few trys.<br> Here are the information they had on our platform. " +
        "They believe this is safe with you..."
    for (let note of notes) {
        emailContent += "<br><br><b>" + note.noteTitle + "</b><br>" + note.note + "<br><i>" + note.additionalComment + "</i>"
    }
    return emailContent
}


//Clear user record
function clearUserData(userId) {
    console.log("clearing user data")
    const condition = {userId: {$eq: userId}}
    User.deleteMany(condition).exec()
    Checkin.deleteMany(condition).exec()
    Contacts.deleteMany(condition).exec()
    Notes.deleteMany(condition).exec()
}