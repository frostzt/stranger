/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

interface RefreshTokenAttrs {
  user: any;
  rtoken: string;
  expires: Date;
  createdAt?: Date;
  revoked?: boolean;
  revokedAt?: Date;
  isExpired?: boolean;
  isActive?: boolean;
}

interface RefreshTokenModel extends mongoose.Model<RefreshTokenDoc> {
  build: (attrs: RefreshTokenAttrs) => RefreshTokenDoc;
}

export interface RefreshTokenDoc extends mongoose.Document {
  user: string;
  rtoken: string;
  expires: Date;
  createdAt: Date;
  revoked: boolean;
  revokedAt: Date;
  isExpired: boolean;
  isActive: boolean;
}

const refreshTokenSchema = new mongoose.Schema<RefreshTokenAttrs>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    rtoken: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: {
      type: Date,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function serializeJson(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.user;
      },
    },
  },
);

refreshTokenSchema.virtual('isExpired').get(function setIsExpired() {
  // @ts-expect-error this refers to the document where this property is called
  return Date.now() >= this.expires;
});

refreshTokenSchema.virtual('isActive').get(function setIsActive() {
  // @ts-expect-error this refers to the document where this property is called
  return !this.revoked && !this.isExpired;
});

// the statics needs to come before the RefreshToken class is created
// eslint-disable-next-line @typescript-eslint/no-use-before-define
refreshTokenSchema.statics.build = (attrs: RefreshTokenAttrs) => new RefreshToken(attrs);

const RefreshToken = mongoose.model<RefreshTokenDoc, RefreshTokenModel>('refreshToken', refreshTokenSchema);

export default RefreshToken;
