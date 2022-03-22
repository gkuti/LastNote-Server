module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            userId: String,
            checkinFrequency: String,
            currentCheckinPhase: String,
            nextCheckin: String
        },
        {timestamps: true}
    )

    schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("checkin", schema);
};