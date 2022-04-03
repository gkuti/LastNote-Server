const db = require("../models");
const {Expo} = require("expo-server-sdk");
const Checkin = db.checkin
const User = db.user

exports.checkin = () => {
    const currentTime = new Date().getTime()
    Checkin.find({checkin: {$eq: false}, nextCheckin: {$gt: currentTime}}).then(data => {
        if (data.length > 0) {
            sendNotification(data)
        }
        //console.log(data)
    }).catch(reason => {
        console.log(reason)
    })
}

async function sendNotification(checkins) {
    let users = []
    for (const checkin of checkins) {
        console.log(checkin)
        const condition = {userId: {$eq: checkin.userId}}
        const result = await User.findOne(condition).exec()
        console.log(result)
        users.push(result)
    }
    let expo = new Expo()
    console.log(users)

// Create the messages that you want to send to clients
    let messages = [];
    for (let user of users) {
        messages.push({
            to: user.pushToken,
            title: 'LastNote',
            body: 'Tap to Checkin',
            data: {userId: user.userId},
        })
    }
    console.log(messages)

    let chunks = expo.chunkPushNotifications(messages);
    // Send the chunks to the Expo push notification service. There are
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
}