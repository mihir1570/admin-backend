const mongoose = require("mongoose")
const cpartnersSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    companyname: String,
    message: String,
    day: String,
    month: String,
    year: String,
    status: String
})
const cpartnersModel = mongoose.model("cpartners", cpartnersSchema)
module.exports = cpartnersModel