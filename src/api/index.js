import express from 'express';

import studentRoute from './routes/studentRoute.js';

const router = express.Router();

// use generics to specify the type of the response body
router.get('/', (req, res) => {
  res.json({
    message: 'routes: students',
  });
});

router.use('/students', studentRoute);

export default router;
