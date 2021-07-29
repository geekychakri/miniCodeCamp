import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  course: String,
  ytURL: String,
  resources: Array,
  quiz: Array,
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;
