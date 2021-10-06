var mongose = require('mongoose');
var Schema = mongose.Schema;

const useSchema = new Schema({
    title: {
        type: String
    },
    snippet: {
        type: String
    },
    body: {
        type: String
    },
    image: {
        type: String
    },
},{timestaps: true})


const Product = mongose.model('post',useSchema);

module.exports = Product;