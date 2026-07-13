import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileImage: {
        type: String,
        degault: "",
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
},
{timestamps: true} // createAt, updateAt
);

const User = mongoose.model("User", userSchema);

export default User;