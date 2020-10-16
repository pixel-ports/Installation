import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    metadata: {
      type: 'Mixed'
    }
  },
  {
    timestamps: true
  }
);

export default model('NotificationLog', mySchema);
