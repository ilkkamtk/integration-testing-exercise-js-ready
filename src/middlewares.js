import CustomError from './classes/CustomError.js';

const notFound = (req, res, next) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const getStudents = async (req, res, next) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/students');
    const students = await response.json();
    // console.log('getStudents', students);
    res.locals.students = students;
    next();
  } catch (error) {
    next(new CustomError(error.message, 500));
  }
};

export {notFound, errorHandler, getStudents};
