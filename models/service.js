const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
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
    costo_total: {
        type: Number,
        required: true
    },
    monto_a_pagar: { // <--- ESTE ES EL CAMPO IMPORTANTE
        type: Number,
        default: 0
    },
    description: String,
    status: {
        type: String,
        enum: ['pendiente', 'en proceso', 'finalizado'], // Validamos que solo sean estos
        default: 'pendiente'
    },
    fecha_inicio: {
        type: Date,
        default: Date.now
    }
});

// Configuración para que el JSON devuelva 'id' en lugar de '_id'
serviceSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Service', serviceSchema);