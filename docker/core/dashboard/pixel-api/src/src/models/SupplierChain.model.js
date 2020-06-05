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
    },
    // label: {
    //   type: 'String'
    // },
    // comment: {
    //   type: 'String'
    // },
    // compatibility: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Compatibility'
    // },
    // details: [String],
    details: [{ type: Schema.Types.Mixed }],
    steps_list: [
      {
        type: Schema.Types.ObjectId,
        ref: 'StepsList'
      }
    ]
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('SupplierChain', mySchema);
