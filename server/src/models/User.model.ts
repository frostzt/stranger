import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import UserRoles from '../Enums/UserRoles.enum';

interface IUser {
  name: string;
  email: string;
  bio?: string;
  role: string;
  username: string;
  password: string;
  createdAt: Date;
  servers?: any[];
}

const userSchema = new mongoose.Schema<IUser>({
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
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: UserRoles.USER,
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

// Encrypt password before save
userSchema.pre('save', async function encryptPassword(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model<IUser>('user', userSchema);

export default User;
