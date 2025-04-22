const { default: mongoose, model } = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_id: { type: String, required: false },
    username: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    image: { type: String, required: false },
    imageId: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserSchema);