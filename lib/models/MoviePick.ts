import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMoviePick extends Document {
  agentId: mongoose.Types.ObjectId;
  title: string;
  year?: number;
  genres: string[];
  vibe: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const MoviePickSchema = new Schema<IMoviePick>(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 180,
    },
    year: {
      type: Number,
      min: 1888,
      max: 2100,
    },
    genres: [{ type: String, maxlength: 40 }],
    vibe: {
      type: String,
      maxlength: 120,
      default: '',
    },
    reason: {
      type: String,
      required: true,
      maxlength: 600,
    },
  },
  { timestamps: true }
);

MoviePickSchema.index({ createdAt: -1 });

const MoviePick: Model<IMoviePick> =
  mongoose.models.MoviePick || mongoose.model<IMoviePick>('MoviePick', MoviePickSchema);

export default MoviePick;
