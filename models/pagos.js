const { Schema, model, Types } = require('mongoose');

const weeklyPaymentSchema = new Schema({
  mechanic: { type: Types.ObjectId, 
    ref: 'Mechanic', 
    required: true },

  startDate:
   { type: Date,
     required: true },

  endDate: 
  { type: Date, 
    required: true },

  totalPaid: 
  { type: Number,
     required: true },

  jobs: [
    {
      job: 
      { type: Types.ObjectId,
         ref: 'Job',
          required: true },

      percentage: 
      { type: Number,
         required: true }, 
         // tomado del job
      amountPaid: 
      { type: Number,
         required: true }  // calculado al cierre
    }
  ]

}, { timestamps: true });

module.exports = model('WeeklyPayment', weeklyPaymentSchema);
