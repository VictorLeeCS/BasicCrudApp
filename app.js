const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Item = require('./models/Item'); 
const methodOverride = require('method-override');
const Joi = require('joi');
const port = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/basicMernCrud');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const verify = (req, res, next) => {
  console.log(req.body);
  const schema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      author: Joi.string().required()
    })
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/home', async (req, res) => {
  const items = await Item.find({});
  res.render('home', { items });
});


app.post('/home',verify, async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.redirect('/home');
});


app.get('/home/:id/edit', async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render('edit', { item });
});

app.put('/home/:id',verify, async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/home');
});

app.delete('/home/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/home');
});