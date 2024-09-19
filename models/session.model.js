import { response } from "express";
import mongoose, { Schema, model } from "mongoose";

const sessionSchema = new Schema({
  
  mentorId: {
    type: String,
    require: true
  },
  studentId: {
    typee: String,
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot:{
    type: String,
    required: true
  },
  status: {
    type: String, 
    enum: ['UPCOMING', 'COMPLETED', 'CANCEL'],
    default: 'UPCOMING'
  },
  feedback: {
    student: {
      rating: {type: Number},
      Comment: {type: String}
    },
    mentor: {
      response: {
        type: String
      }
    }
  }
}, { timestamps: true });


const Session = model('Session', sessionSchema);

export default Session;