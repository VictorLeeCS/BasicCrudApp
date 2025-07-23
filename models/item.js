const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    author: String
});


module.exports = mongoose.model('Item', itemSchema);
