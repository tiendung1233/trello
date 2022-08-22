import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const todoItem = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  }
})

const courseSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  todo: {
    type: String,
    required: true,
  },
  todoItem :[todoItem],
  index: {
    type: Number,
    required: true,
  },
});



export default mongoose.model('Course', courseSchema);
