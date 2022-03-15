module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            userId: String,
            contactName: String,
            contactEmail: String,
            contactPhones: String,
        },
        {timestamps: true}
    )

    schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("contact", schema);
};