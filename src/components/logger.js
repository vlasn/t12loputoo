const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const Request = mongoose.Schema({
    from: String,
    timestamp: Date,
    body: Object,
    issues: String
})
const RequestModel = mongoose.model("Request", Request)

const log = (input, errors) => {
    let R = new RequestModel({
       from: input.from,
       timestamp: Date.now(),
       body: input,
        issues: JSON.stringify(errors)
    })
    return R.save()
}
const get = (int) => {
    if(typeof(int)!=="number") int = parseInt(int);
    return RequestModel.find({}).sort({_id:-1}).limit(int)
}

module.exports = {log, get}