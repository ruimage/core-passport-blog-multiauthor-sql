const ReactDOMServer = require('react-dom/server');
const React = require('react');
const router = require('express').Router();

const Registration = require('../views/auth/Registration');
const Login = require('../views/auth/Login');

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

router.get('/login', (req, res) => {
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

router.post('/register', async (req, res) => {
  try {
    res.redirect('/');
  } catch (error) {
    const errorPage = React.createElement(Error, {
      message: 'Не удалось добавить запись в базу данных.',
      error: {},
    });

    const html = ReactDOMServer.renderToStaticMarkup(errorPage);
    res.write('<!DOCTYPE html>');
    res.end(html);
  }
});

module.exports = router;
