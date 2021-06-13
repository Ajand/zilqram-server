const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  variant: {
    type: String,
    enum: ["direct", "group", "secret"],
  },
  belongsTo: mongoose.Types.ObjectId,
  participants: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      admin: {
        type: Boolean,
        default: false,
      },
      seenAt: {
        type: Date,
      },
    },
  ],
  info: {
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  pin: mongoose.Types.ObjectId,
}, {
  timestamps: true
});

module.exports = mongoose.model("conversation", ConversationSchema);

