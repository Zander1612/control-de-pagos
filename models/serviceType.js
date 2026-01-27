const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'El nombre del servicio es obligatorio'], 
        unique: true,
        trim: true // Limpia "  Aceite  " a "Aceite"
    },
    percentage: {
        type: Number,
        required: [true, 'El porcentaje es obligatorio'],
        min: 0,   // Un mecánico no puede ganar -10%
        max: 100  // El taller no puede pagar más del 100% (a menos que seas muy generoso)
    }
}, { timestamps: true });

// Mantener la consistencia con el ID para el frontend
serviceTypeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema);