const mongoose = require("mongoose")
const getintouchSchema = mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    message: String,
    day: String,
    month: String,
    year: String,
    status: String
})
const getintouchModel = mongoose.model("getintouchs", getintouchSchema)
module.exports = getintouchModel