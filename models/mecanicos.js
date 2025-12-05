const { Schema, model } = require('mongoose');

const mechanicSchema = new Schema({
  name:
   { type: String,
     required: true },
  cedula:
   { type: String,
     required: true,
      unique: true },
  email: 
  { type: String,
     required: true },
  phone: 
  { type: String,
     required: true },
  active: 
  { type: Boolean,
     default: true }
     
    }, { timestamps: true });

module.exports = model('Mechanic', mechanicSchema);
