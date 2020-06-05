import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    // idAssignment: {
    //   type: 'String'
    // },
    idRule: {
      type: 'String'
    },

    assignment: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Assignment', mySchema);
