const mongoose = require('mongoose');

const semanaSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['open', 'closed'], 
        default: 'open' 
    },
    totalGenerated: { 
        type: Number, 
        default: 0,
        min: 0 // Seguridad extra
    }
}, { timestamps: true }); // Para saber cuándo se cerró la semana exactamente

semanaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        // Opcional: Formatear las fechas para que el frontend no tenga que pelear con ISOStrings
        returnedObject.formatedStart = returnedObject.startDate.toLocaleDateString('es-ES');
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Semana', semanaSchema);