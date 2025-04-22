const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: false },
    userImage: { type: String, required: false },
    img_url: { type: String, required: false },
    format: { type: String, required: false },
    public_id: { type: String, required: false },
    post_id: { type: String, required: false },
    text: { type: String, required: false },
    liked: [String],
    comment: [String],
}, { timestamps: true });

export default mongoose.models.publishImage || mongoose.model('publishImage', UserSchema);