import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    // idValidity: {
    //   type: 'String'
    // },
    idRule: {
      type: 'String'
    },
    validity: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Validity', mySchema);
