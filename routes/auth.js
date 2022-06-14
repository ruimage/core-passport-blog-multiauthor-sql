const ReactDOMServer = require('react-dom/server');
const React = require('react');
const router = require('express').Router();

const bcrypt = require('bcrypt');
const Registration = require('../views/auth/Registration');
const Login = require('../views/auth/Login');
const Error = require('../views/Error');
const { User } = require('../db/models');

router.get('/register', (req, res) => {
  try {
    const registration = React.createElement(Registration);
    const html = ReactDOMServer.renderToStaticMarkup(registration);
    res.write('<!DOCTYPE html>');
    res.end(html);
  } catch (error) {
    const errorPage = React.createElement(Error, {
      message: 'Не удалось открыть страницу регистрации',
      error: {},
    });
    const html = ReactDOMServer.renderToStaticMarkup(errorPage);
    res.write('<!DOCTYPE html>');
    res.end(html);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (user) {
      res.send('Уже существует подобный пользователь');
      return;
    }
    const newUser = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    req.session.userId = newUser.id;
    res.redirect('/');
  } catch
  (error) {
    const errorPage = React.createElement(Error, {
      message: 'Не удалось добавить запись в базу данных.',
      error: {},
    });

    const html = ReactDOMServer.renderToStaticMarkup(errorPage);
    res.write('<!DOCTYPE html>');
    res.end(html);
  }
});
router.get('/login', async (req, res) => {
  try {
    const login = React.createElement(Login);
    const html = ReactDOMServer.renderToStaticMarkup(login);
    res.write('<!DOCTYPE html>');
    res.end(html);
  } catch (error) {
    const errorPage = React.createElement(Error, {
      message: 'Не удалось открыть страницу регистрации',
      error: {},
    });
    const html = ReactDOMServer.renderToStaticMarkup(errorPage);
    res.write('<!DOCTYPE html>');
    res.end(html);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser && bcrypt.compare(password, existingUser.password)) {
      req.session.userId = existingUser.id;
      res.redirect('/');
    }
  } catch (error) {
    const errorPage = React.createElement(Error, {
      message: 'Ошибка в данных входа',
      error: {},
    });
    const html = ReactDOMServer.renderToStaticMarkup(errorPage);
    res.write('<!DOCTYPE html>');
    res.end(html);
  }
});

module.exports = router;
