const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    description: { 
        type: String, 
        required: [true, 'La descripción es obligatoria'], // Agregamos mensaje de error
        trim: true // Elimina espacios en blanco accidentales al inicio/final
    },
    totalAmount: { 
        type: Number, 
        required: true,
        min: 0 // Evita que alguien guarde montos negativos por error
    },
    mechanicAmount: { 
        type: Number, 
        required: true,
        min: 0
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    
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
        ref: 'Semana',
        required: true
    }
}, { timestamps: true }); 