import { Schema } from 'mongoose';

// define your multi language fields here
export const multiLanguageSchema = new Schema(
  {
    en: String,
    fa: String,
  },
  {
    _id: false, // This prevents Mongoose from automatically adding an _id field
  }
);

export interface MultiLanguageContent {
  en: string;
  fa: string;
}
