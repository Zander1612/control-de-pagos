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
    verified: { 
        type: Boolean, 
        default: false 
    },
    // Añadimos el rol para diferenciar entre Admin y Mecánico
    role: {
        type: String,
        enum: ['admin', 'mecanico'],
        default: 'mecanico'
    },
    // Referencia a los servicios realizados por este mecánico
    servicios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; // Por seguridad nunca enviamos el hash al frontend
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;