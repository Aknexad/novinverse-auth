const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

const users = [];

// meddeware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: '1234',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);

// set view engin
app.set('view engine', 'pug');

// render page
app.get('/', (req, res) => {
  res.render('home.pug', { pageTitle: 'home' });
});

app.get('/login', (req, res) => {
  res.render('login.pug', { pageTitle: 'login page' });
});

app.get('/register', (req, res) => {
  res.render('register.pug', { pageTitle: 'register page' });
});

// post routes
app.post('/register', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 7);
    users.push({
      id: users.length + 1,
      username: req.body.username,
      password: hashedPass,
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server run on ${port}`));
