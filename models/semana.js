const mongoose = require('mongoose');

const semanaSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['open', 'closed'], 
        default: 'open' 
    },
    totalGenerated: { type: Number, default: 0 } // Suma total del taller
});

module.exports = mongoose.model('Semana', semanaSchema);