const mongoose  = require("mongoose")

const medicine = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String,
    composition: String,
    type: String,
    quantity: Number,
    unit: String
}, {
    strict: false,
    collection: 'medicines'
})

module.exports = mongoose.model('medicine', medicine)