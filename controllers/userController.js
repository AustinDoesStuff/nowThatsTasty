const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', {title: 'Login'})
};

exports.registerForm = (req, res) => {
  res.render('register', {title: 'Register'});
};

exports.checkEmail = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if(user) {
    req.flash('error', 'An account with this email already exists');
    return res.redirect('/login');
  }
  next();
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'I need a name!').notEmpty();
  req.checkBody('email', 'That email isn\'t even valid').notEmpty().isEmail()
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'I need a password, fam').notEmpty();
  req.checkBody('password-confirm', 'Please confirm your password').notEmpty();
  req.checkBody('password-confirm', 'OOPS! Your passwords don\'t match').equals(req.body.password);

  const errs = req.validationErrors();

  if (errs) {
    req.flash('error', errs.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);

  await register(user, req.body.password);
  next();
};

exports.account = (req, res) => {
  res.render('account', { title: 'Edit your account' });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query'}
  );

  req.flash('success', 'It\'s updated! You ain\'t break it!');
  res.redirect('back');
};