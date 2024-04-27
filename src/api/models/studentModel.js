import {promisePool} from '../../utils/db.js';
import CustomError from '../../classes/CustomError.js';

const getAllStudents = async () => {
  const [rows] = await promisePool.execute('SELECT * FROM students;');
  if (rows.length === 0) {
    throw new CustomError('No students found', 404);
  }

  return rows;
};

const getStudent = async (studentId) => {
  const [rows] = await promisePool.execute(
    `
    SELECT * FROM students
	  WHERE student_id = ?;
    `,
    [studentId]
  );
  if (rows.length === 0) {
    throw new CustomError('No students found', 404);
  }
  return rows[0];
};

const addStudent = async (data) => {
  const [headers] = await promisePool.execute(
    `
    INSERT INTO students (student_name, filename, birthdate) 
    VALUES (?, ?, ?)
    `,
    [data.student_name, data.filename, data.birthdate]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('No students added', 400);
  }
  return headers.insertId;
};

const updateStudent = async (data, id) => {
  const sql = promisePool.format(
    'UPDATE students SET ? WHERE student_id = ?;',
    [data, id]
  );

  const [headers] = await promisePool.execute(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('No students found', 400);
  }
  return true;
};

const deleteStudent = async (studentId) => {
  const [headers] = await promisePool.execute(
    `
    DELETE FROM students 
    WHERE student_id = ?;
    `,
    [studentId]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('No students found', 400);
  }
  return true;
};

export {getAllStudents, getStudent, addStudent, updateStudent, deleteStudent};
