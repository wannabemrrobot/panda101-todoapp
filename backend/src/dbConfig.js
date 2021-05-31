const mongoose = require('mongoose');
const uri ='mongoconnection uri'
mongoose.connect(
    uri,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })

var todoSchema = new mongoose.Schema({
    todo: String,
    priority: Number,
    completed: Boolean,
    date: Date,
    trashed: Boolean,
})

var userSchema = new mongoose.Schema({
    uid: String,
    username: String,
    email : String,
    tagname : String,
    todo: [todoSchema],
})

module.exports = User = mongoose.model('p101', userSchema);