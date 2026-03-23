const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, required: true },
  currentStep: { type: Number, default: 1 },
  completedSteps: [Number],
  steps: {
    idea: { type: mongoose.Schema.Types.Mixed, default: {} },
    market: { type: mongoose.Schema.Types.Mixed, default: {} },
    product: { type: mongoose.Schema.Types.Mixed, default: {} },
    plan: { type: mongoose.Schema.Types.Mixed, default: {} },
    marketing: { type: mongoose.Schema.Types.Mixed, default: {} },
    launch: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);
