// empty still. coming soon
const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect('mongodb://localhost/MitBahn', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const users = [
  {
    userName: 'Vic',
    password: '123456',
    firstName: 'vic',
    lastName: 'tor',
    email: 'victor@email.de',
    rating: '5',
    role: 'admin'
  },
  {
    userName: 'Jan',
    password: '123456',
    firstName: 'Jan',
    lastName: 'go',
    email: 'janG@email.de',
    rating: '5',
    role: 'admin'
  },
  {
    userName: 'Pat',
    password: '123456',
    firstName: 'Pat',
    lastName: 'rick',
    email: 'patrick@email.de',
    rating: '5',
    role: 'admin'
  },
  
];
User.insertMany(users)
  .then(result => {
    console.log('Seed successfull');
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(`An error occured: ${err}`);
  });