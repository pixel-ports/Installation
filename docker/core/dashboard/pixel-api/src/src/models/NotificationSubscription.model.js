import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    user: {
      type: 'String'
    },
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'NotificationTemplate'
      }
    ]
  },
  {
    timestamps: true
  }
);

export default model('NotificationSubscription', mySchema);
