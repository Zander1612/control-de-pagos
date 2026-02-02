const mongoose = require('mongoose');

const semanaSchema = new mongoose.Schema({
    // Renombrado: de startDate a fecha_inicio_semana (como en tu boceto)
    fecha_inicio_semana: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    // Renombrado: de endDate a fecha_fin_semana (como en tu boceto)
    fecha_fin_semana: { 
        type: Date 
    }, 
    status: { 
        type: String, 
        enum: ['open', 'closed'], 
        default: 'open' 
    },
    // Tu campo "Monto Total Pagado"
    totalGenerated: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    // NUEVO: Tu campo "Trabajos incluidos" del boceto
    // Aquí guardaremos la lista de IDs de todos los trabajos de esta semana
    trabajos_incluidos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }]
}, { timestamps: true });

semanaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Semana', semanaSchema);