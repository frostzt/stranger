import mongoose from 'mongoose';

interface ServerAttrs {
  name: string;
  description: string;
  users?: any[];
  admins?: any[];
  groups?: any[];
}

interface ServerModel extends mongoose.Model<ServerDoc> {
  build: (attrs: ServerAttrs) => ServerDoc;
}

interface ServerDoc extends mongoose.Document {
  name: string;
  description: string;
  users?: any[];
  admins?: any[];
  groups?: any[];
}

const serverSchema = new mongoose.Schema<ServerAttrs>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'group',
    },
  ],
});

// Statics should be assigned before creating the constructor
// eslint-disable-next-line @typescript-eslint/no-use-before-define
serverSchema.statics.build = (attrs: ServerAttrs) => new Server(attrs);

const Server = mongoose.model<ServerDoc, ServerModel>('server', serverSchema);

export default Server;
