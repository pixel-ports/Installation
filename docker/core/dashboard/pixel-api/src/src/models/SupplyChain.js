import { model, Schema } from 'mongoose';

const mySchema = new Schema(
  {
    name: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    exportToIH_pending: {
      type: 'Boolean'
    } /* ,
    areas: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Area'
      }
    ],
    machines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Machine'
      }
    ] */
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('SupplyChain', mySchema);
