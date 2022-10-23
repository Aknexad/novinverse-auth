const express = require('express');
const session = require('express-session');

const app = express();

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

app.get('/', (req, res) => {
  res.render('home.pug', { pageTitle: 'home' });
});

app.get('/login', (req, res) => {
  res.render('login.pug', { pageTitle: 'login page' });
});

app.get('/register', (req, res) => {
  res.render('register.pug', { pageTitle: 'register page' });
});

app.post('/register', (req, res) => {});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server run on ${port}`));
