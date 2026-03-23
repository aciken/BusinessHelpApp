const express = require('express');
const app = express();
const port = 4000;
app.use(express.json());
const cors = require('cors');
app.use(cors());

const Signup = require('./Auth/Signup');
const Signin = require('./Auth/signin');
const Verify = require('./Auth/verify');
const AppleSign = require('./Auth/AppleSign');
const googleAuth = require('./Auth/googleAuth');
const deleteAccount = require('./Auth/deleteAccount');

const createProject = require('./Project/createProject');
const getProjects = require('./Project/getProjects');
const updateProject = require('./Project/updateProject');



app.get('/', (req, res) => {
    res.send('Hello World!');
  });


  app.put('/signup', Signup);
  app.post('/signin', Signin);
  app.post('/auth/apple', AppleSign);
  app.post('/auth/google', googleAuth);
  app.post('/auth/delete', deleteAccount);
  app.put('/verify', Verify);

  app.post('/projects/create', createProject);
  app.get('/projects', getProjects);
  app.put('/projects/update', updateProject);


  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });