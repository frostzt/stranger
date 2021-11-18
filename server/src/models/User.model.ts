/* eslint-disable no-param-reassign */
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import UserRoles from '../Enums/UserRoles.enum';

interface UserAttrs {
  name: string;
  email: string;
  bio?: string;
  role?: string;
  username: string;
  password: string;
  createdAt?: Date;
  servers?: any[];
}

interface UserModel extends mongoose.Model<UserDoc> {
  build: (attrs: UserAttrs) => UserDoc;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  bio?: string;
  role?: string;
  username: string;
  password: string;
  createdAt?: Date;
  servers?: any[];
  correctPassword: (candidatePassword: string, userPassword: string) => boolean;
}

const userSchema = new mongoose.Schema<UserAttrs>(
  {
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
  },
  {
    toJSON: {
      versionKey: false,
      transform: function serializeDoc(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  },
);

// Encrypt password before save
userSchema.pre('save', async function encryptPassword(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// the statics needs to come before the User object is created
// eslint-disable-next-line @typescript-eslint/no-use-before-define
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

export default User;
