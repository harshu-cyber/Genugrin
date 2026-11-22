const mongoose = require('mongoose');

const websiteContentSchema = new mongoose.Schema(
  {
    sectionKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // e.g. 'hero', 'about', 'mission_vision', 'why_choose_us', 'quality_assurance', 'footer'
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model('WebsiteContent', websiteContentSchema);
