const mongoose = require("mongoose")
const inquiriesSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    interest: String,
    day: String,
    month: String,
    year: String,
    status: String
})
const inquiriesModel = mongoose.model("inquiries", inquiriesSchema)
module.exports = inquiriesModel


