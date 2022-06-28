import mongoose, { Schema, Document } from "mongoose";

type TeamsDocument = Document & {
  id: string,
  name: string,
}

const teamSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})

export default mongoose.model<TeamsDocument>("Teams", teamSchema);
