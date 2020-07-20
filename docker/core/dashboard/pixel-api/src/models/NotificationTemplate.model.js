import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    title: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    definition: {
      type: 'Mixed'
    },
    type: {
      type: 'String'
    }
  },
  {
    timestamps: true
  }
);

export default model('NotificationTemplate', mySchema);
