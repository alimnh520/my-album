const { default: mongoose, models } = require("mongoose");

const MessageSchema = new mongoose.Schema({
    sender: [String],
    receiver: [String],
    text: [String],
}, { timestamps: true });
export default mongoose.models.UserMessage || mongoose.model('UserMessage', MessageSchema);