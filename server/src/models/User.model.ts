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
    lowercase: true,
  },
  bio: {
    type: String,
    maxlength: 250,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  servers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'server',
    },
  ],
});

const User = mongoose.model('user', userSchema);

export default User;
