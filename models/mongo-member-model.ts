import mongoose, { Schema, Document } from "mongoose";

type MembersDocument = Document & {
  firstName: string,
  lastName: string,
  age: number,
  gender: string,
  birthdate: Date,
  country: string,
  teamNumber: string
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
  },
  country: {
    type: String,
    required: true,
  },
  teamNumber: {
    type: String,
    required: true,
  }
})

export default mongoose.model<MembersDocument>("Members", memberSchema);
