const mongoose = require("mongoose")
const teamSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    select: String,
    image: String,
    comment: String,
    day: String,
    month: String,
    year: String,
    status: String
})
const teamModel = mongoose.model("joinourteams", teamSchema)
module.exports = teamModel