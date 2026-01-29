const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  name: String,
  percentage: Number // Asegúrate que diga "percentage"
});

serviceTypeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('ServiceType', serviceTypeSchema);