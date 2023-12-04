const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenomeSchema = new Schema({
    chromosome: String,
    start: Number,
    end: Number,
    direction : String,
    id: String,
    name: String
});

module.exports = mongoose.model('Genome', GenomeSchema);