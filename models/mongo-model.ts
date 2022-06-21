import mongoose, { Schema, Document } from "mongoose";

type MembersDocument = Document & {
  firstName: string,
  lastName: string,
  age: number,
  gender: string,
  birthdate: Date
}

const memberSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  }
})

export default mongoose.model<MembersDocument>("Members", memberSchema);
