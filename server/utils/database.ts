import "dotenv/config";

import mongoose from "mongoose";

import { Schema, model, connect } from "mongoose";
import { Site } from "~/shared.types";

console.log(process.env.MONGODB_URI!);

mongoose
  .connect(process.env.MONGODB_URI!, { dbName: "heer-nav-test" })
  .then(() => {
    console.log("Connected to MongoDB");
  });

const siteSchema = new Schema<Site>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  avatar: {
    url: { type: String },
  },
  desc: { type: String, required: true },
  type: { type: String, enum: ["common", "repo"], default: "common" }, // 默认为 'common' 类型
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  encrypted: {
    type: {
      url: { type: String, required: true },
      tip: { type: String },
    },
    required: false,
  },
});

const SiteModel = mongoose.model("Site", siteSchema);
export { SiteModel };
