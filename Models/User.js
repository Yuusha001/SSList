const mongose = require('mongoose');
const Schema = mongose.Schema;

const useSchema = new Schema({
    userName: {
        type: String, unique: true
    },
    password: {
        type: String
    },
    Name: {
        type: String
    },
    email: {
        type: String
    },
},{timestaps: true})


const User = mongose.model('User',useSchema);

module.exports = User;