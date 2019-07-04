require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

// connects with database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

//console logs outputs on error or established connection
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Database'));

//middleware for the server to accept JSON
app.use(express.json());

//Routes for endpoints
const usersRouter = require('./routes/users');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users/', usersRouter);
app.use(express.static(path.join(__dirname, 'dist')));

const todosRouter = require('./routes/todos');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/todos/', todosRouter);
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes & return index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//starts server
app.listen(3000, () => console.log('Server has started'));
