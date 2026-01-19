const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
    name: { 
        type: String,
         required: true, 
         unique: true 
        },
    percentage: {
         type: Number,
          required: true 
        }
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema);