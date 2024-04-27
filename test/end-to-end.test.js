import {testTableStructure} from './indexTests.js';
import {testPostingStudent} from './postTests.js';
import {getStudents} from './studentTests.js';
import randomstring from 'randomstring';
const serverUrl = 'http://localhost:3000';

describe('Table structure', () => {
  test('should post new student', async () => {
    const student = {
      student_name: 'Test ' + randomstring.generate(7),
      filename: 'cat.jpg',
    };
    await testPostingStudent(serverUrl, student);
  }, 20000);

  test('should have correct structure', async () => {
    const data = await getStudents(serverUrl);
    await testTableStructure(serverUrl, data);
  }, 16000);
});
