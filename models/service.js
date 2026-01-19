const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    description: { 
        type: String, 
        required: true },
    totalAmount: { 
        type: Number, 
        required: true 
    }, // Lo que pagó el cliente
    mechanicAmount: { 
        type: Number, 
        required: true 
    }, // Lo que gana el mecánico (calculado)
    date: { type: Date, default: Date.now },
    
    // Relaciones
    mechanic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceType',
        required: true
    },
    semana: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semana', // Para agrupar los pagos por semana
        required: true
    }
});

serviceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Service', serviceSchema);