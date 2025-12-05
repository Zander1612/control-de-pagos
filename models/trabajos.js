const { Schema, model, Types } = require('mongoose');

const jobSchema = new Schema({
  service: { type: String, required: true },
  description: { type: String },
  totalCost: { type: Number, required: true },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date },

  status: { 
    type: String, 
    enum: ['pendiente', 'completado', 'cancelado'], 
    default: 'pendiente' 
  },

  mechanics: [
    {
      mechanic: 
      { type: Types.ObjectId,
         ref: 'Mechanic',
          required: true },
      percentage: 
      { type: Number,
         required: true }, // 50, 100, 25, etc.
      amountEarned:
       { type: Number } // se calcula después
    }
  ]

}, { timestamps: true });

module.exports = model('Job', jobSchema);
