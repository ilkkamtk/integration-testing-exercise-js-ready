import express from 'express';
import {
  studentDelete,
  studentGet,
  studentListGet,
  studentPost,
  studentPut,
} from '../controllers/studentController.js';
import multer from 'multer';
import {body, param} from 'express-validator';

const fileFilter = (request, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

// no generics here because of types in controllers
router
  .route('/')
  .get(studentListGet)
  .post(
    upload.single('image'),
    body('student_name').notEmpty().escape(),
    body('birthdate').isDate(),
    studentPost
  );

router
  .route('/:id')
  .get(param('id'), studentGet)
  .put(
    param('id'),
    body('student_name').escape().optional(),
    body('birthdate').isDate().optional(),
    studentPut
  )
  .delete(param('id'), studentDelete);

export default router;
