import mongoose from 'mongoose';

const userSchema: mongoose.Schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    applications: {
        type: Array
    }
},
{
    timestamps: true
});

export const UserModel = mongoose.model("user", userSchema);
