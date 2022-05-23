const add = require("date-fns/add");

exports.getNextCheckinDate = (checkinFrequency) => {
    let date
    if (checkinFrequency === "1minute") {
        date = add(new Date(), {minutes: 1})
    } else if (checkinFrequency === "daily") {
        date = add(new Date(), {days: 1})
    } else if (checkinFrequency === "weekly") {
        date = add(new Date(), {weeks: 1})
    } else if (checkinFrequency === "monthly") {
        date = add(new Date(), {months: 1})
    } else if (checkinFrequency === "6months") {
        date = add(new Date(), {months: 6})
    }
    return date
}