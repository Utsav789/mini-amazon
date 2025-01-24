import mongoose from 'mongoose';

// set schema/rule/structure
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    lowercase: true,
    unique: true, //index
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  dob: {
    type: Date,
    max: Date.now(),
    required: false,
  },
  gender: {
    type: String,
    trim: true,
    required: true,
    enum: ['male', 'female', 'other'],
  },
  role: {
    type: String,
    required: true,
    trim: true,
    enum: ['seller', 'buyer'],
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
});

// create table/model/collection
const UserTable = mongoose.model('User', userSchema);

export default UserTable;