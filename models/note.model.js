module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            userId: String,
            noteTitle: String,
            note: String,
            additionalComment: String
        },
        {timestamps: true}
    )

    schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("note", schema);
};