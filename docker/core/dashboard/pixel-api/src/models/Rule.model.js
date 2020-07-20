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
    cargoes_categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CargoCategory'
      }
    ],
    shiftworks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ShiftWork'
      }
    ],
    priority: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Priority'
      }
    ]
    // assignments: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Assignment'
    //   }
    // ],
    // validities: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Validity'
    //   }
    // ]
  },
  {
    timestamps: true
  }
);

mySchema.index({ '$**': 'text' });

export default model('Rule', mySchema);
