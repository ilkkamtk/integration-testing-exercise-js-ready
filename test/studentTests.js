import request from 'supertest';

const getStudents = (url) => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/students')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cats = response.body;
          cats.forEach((student) => {
            expect(student).toHaveProperty('student_id');
            expect(student).toHaveProperty('student_name');
            expect(student).toHaveProperty('birthdate');
          });
          resolve(cats);
        }
      });
  });
};

const getSingleStudent = (url, id) => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/students/' + id)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const student = response.body;
          expect(student).toHaveProperty('student_id');
          expect(student).toHaveProperty('student_name');
          expect(student).toHaveProperty('birthdate');
          resolve(response.body);
        }
      });
  });
};

const postStudent = (url, student) => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/students/')
      .set('Content-type', 'form-data')
      .attach('image', 'test/' + student.filename)
      .field('student_name', student.student_name)
      .field('birthdate', student.birthdate)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result = response.body;
          expect(result.id).not.toBe('');
          expect(result.message).toBe('Student created successfully');
          resolve(result);
        }
      });
  });
};

// user modify student
const putStudent = (url, student, id) => {
  return new Promise((resolve, reject) => {
    request(url)
      .put('/api/v1/students/' + id)
      .set('Content-type', 'application/json')
      .send({
        student_name: student.student_name,
        birthdate: student.birthdate,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result = response.body;
          expect(result.message).toBe('Student updated successfully');
          resolve(result);
        }
      });
  });
};

//  delete student
const deleteStudent = (url, id) => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete('/api/v1/students/' + id)
      .set('Content-type', 'application/json')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const result = response.body;
          expect(result.message).toBe('Student deleted successfully');
          expect(result.id).toBe(id);
          resolve(result);
        }
      });
  });
};

export {getStudents, getSingleStudent, postStudent, putStudent, deleteStudent};
