import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

// ** replicate the functionality for the CommonJS’s __dirname *****
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
// ****************************************************************

import {notFound, errorHandler, getStudents} from './middlewares.js';
import api from './api/index.js';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// serve static files
app.use(express.static('./public'));

// serve uploaded files
app.use('/uploads', express.static('./uploads'));

// use generics to specify the type of the response body
app.get('/', (_req, res) => {
  res.json({
    message: 'API location: api/v1',
  });
});

app.use('/api/v1', api);

// ****  serve html with ejs template engine ****

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));

// index page
app.get('/ui', getStudents, (_req, res) => {
  // console.log(res.locals.students);
  res.render('pages/index', {
    title: 'Students',
    js: [],
    data: {
      students: res.locals.students,
    },
  });
});

// post page
app.get('/ui/post', (_req, res) => {
  res.render('pages/post', {
    title: 'Post',
    js: ['post.js'],
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
