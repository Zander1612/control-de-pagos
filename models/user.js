const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,         
        lowercase: true     
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    verified: { // LO MANTENEMOS para tu sistema de verificación por correo
        type: Boolean, 
        default: false 
    },
    role: {
        type: String,
        enum: ['admin', 'mecanico'],
        default: 'mecanico'
    },
    // NUEVO: Para cumplir con tu boceto de pagos
    // Aquí se sumará lo que el mecánico gane cada semana
    acumuladoHisto: {
        type: Number,
        default: 0
    },
    servicios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }]
}, { timestamps: true });

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;