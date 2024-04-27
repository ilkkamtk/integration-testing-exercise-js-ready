import {
  addStudent,
  deleteStudent,
  getAllStudents,
  getStudent,
  updateStudent,
} from '../models/studentModel.js';
import CustomError from '../../classes/CustomError.js';
import {validationResult} from 'express-validator';
import fs from 'fs';

const studentListGet = async (req, res, next) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
};

const studentGet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const student = await getStudent(req.params.id);
    res.json(student);
  } catch (error) {
    next(error);
  }
};

const studentPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      next(new CustomError(messages, 400));
      return;
    }

    if (!req.file) {
      const err = new CustomError('file not valid', 400);
      throw err;
    }

    const student = req.body;
    student.filename = req.file.filename;

    const id = await addStudent(student);
    const message = {
      message: 'Student created successfully',
      id: id,
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const studentPut = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = parseInt(req.params.id);
    const student = req.body;
    const result = await updateStudent(student, id);
    if (result) {
      const message = {
        message: 'Student updated successfully',
        id,
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const studentDelete = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = parseInt(req.params.id);
    // delete file from uploads
    const student = await getStudent(req.params.id);
    const path = `./uploads/${student.filename}`;
    fs.unlink(path, (error) => {
      if (error) {
        next(error);
        return;
      }
    });

    const result = await deleteStudent(id);
    if (result) {
      const message = {
        message: 'Student deleted successfully',
        id,
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {studentListGet, studentGet, studentPost, studentPut, studentDelete};
