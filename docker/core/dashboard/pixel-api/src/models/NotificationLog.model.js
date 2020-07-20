import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    notification: {
      type: Schema.Types.ObjectId,
      ref: 'NotificationTemplate'
    },
    metadata: {
      type: 'Mixed'
    }
  },
  {
    timestamps: true
  }
);

export default model('NotificationLog', mySchema);
