import express from 'express';
import { createCourse, getAllCourse, getSingleCourse, updateCourse, deleteCourse } from '../controllers/course.js';

const router = express.Router();
router.post('/courses', createCourse);


router.get('/courses', getAllCourse);


router.get('/courses/:courseId', getSingleCourse);


router.patch('/courses/:courseId', updateCourse);



router.delete('/courses/:courseId', deleteCourse);


export default router;
