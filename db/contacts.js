const mongoose = require("mongoose")
const contactSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    select: String,
    message: String,
    day: String,
    month: String,
    year: String,
    status: String
})
const contactModel = mongoose.model("contacts", contactSchema)
module.exports = contactModel

