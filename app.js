const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// DB
const users = [];

// passpor  //

// passport function auth
async function authenticateUser(username, password, done) {
  const user = users.find((user) => user.username === username);
  if (user == null) {
    return done(null, false, { message: 'user dont exist' });
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      done(null, user);
    } else {
      done(null, false, { message: 'passwords dont mach' });
    }
  } catch (error) {
    done(error);
  }
}

// passport config
passport.use(new LocalStrategy(authenticateUser));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  done(
    null,
    users.find((user) => user.id === id)
  );
});

// meddeware //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(flash());
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
app.use(passport.initialize());
app.use(passport.session());

// set view engin
app.set('view engine', 'pug');

// render page //

// home page
app.get('/', (req, res) => {
  const name = req.user;
  res.render('home.pug', { pageTitle: 'home', name: name });
});

// login page

app.get('/login', chackIsAuthUser, (req, res) => {
  res.render('login.pug', { pageTitle: 'login page' });
});

// register page

app.get('/register', chackIsAuthUser, (req, res) => {
  res.render('register.pug', { pageTitle: 'register page' });
});

// logout route
app.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// post route //

// register post route
app.post('/register', chackIsAuthUser, async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 7);
    users.push({
      id: users.length + 1,
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    res.redirect('/login');
  } catch {
    res.redirect('/register');
  }
});

// login post route
app.post(
  '/login',
  chackIsAuthUser,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// chacking user auth or not //
function chackIsAuthUser(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server run on ${port}`));
