import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({});

const User = mongoose.model('user', userSchema);

export default User;
