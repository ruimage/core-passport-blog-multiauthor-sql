const ReactDOMServer = require('react-dom/server');
const React = require('react');
const router = require('express').Router();

const EntriesList = require('../views/entries/EntriesList');
const EditEntry = require('../views/entries/EditEntry');
const NewEntry = require('../views/entries/NewEntry');
const ShowEntry = require('../views/entries/ShowEntry');
const Error = require('../views/Error');

const { Entry } = require('../db/models');

router.get('/', async (req, res) => {
  try {
    const entries = await Entry.findAll({ order: [['id', 'DESC']] });

    const entriesList = React.createElement(EntriesList, { entries });
    const html = ReactDOMServer.renderToStaticMarkup(entriesList);
    res.write('<!DOCTYPE html>');
    res.end(html);
  } catch (error) {
    const errorPage = React.createElement(Error, {
      message: 'Не удалось получить записи из базы данных.',
      error: {},
    });
    const html = ReactDOMServer.renderToStaticMarkup(errorPage);
    res.write('<!DOCTYPE html>');
    res.end(html);
  }
});

router.post('/', async (req, res) => {
  try {
    const newEntry = await Entry.create({
      title: req.body.title,
      body: req.body.body,
    }, {
      returning: true,
      plain: true,
    });

    res.redirect(`/entries/${newEntry.id}`);
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

router.get('/new', (req, res) => {
  const newEntry = React.createElement(NewEntry, {});
  const html = ReactDOMServer.renderToStaticMarkup(newEntry);
  res.write('<!DOCTYPE html>');
  res.end(html);
});

router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findOne({ where: { id: req.params.id } });
    const showEntry = React.createElement(ShowEntry, { entry });
    const html = ReactDOMServer.renderToStaticMarkup(showEntry);
    res.write('<!DOCTYPE html>');
    res.end(html);
  } catch (error) {
    const errorPage = React.createElement(Error, {
      message: 'Не удалось получить запись из базы данных.',
      error: {},
    });

    const html = ReactDOMServer.renderToStaticMarkup(errorPage);
    res.write('<!DOCTYPE html>');
    res.end(html);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const entry = await Entry.update({
      title: req.body.title,
      body: req.body.body,
    }, {
      where: { id: req.params.id },
      returning: true,
      plain: true,
    });

    res.json({ isUpdateSuccessful: true, entryID: entry[1].id });
  } catch (error) {
    res.json({
      isUpdateSuccessful: false,
      errorMessage: 'Не удалось обновить запись в базе данных.',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Entry.destroy({ where: { id: req.params.id } });
    res.json({ isDeleteSuccessful: true });
  } catch (error) {
    res.json({
      isDeleteSuccessful: false,
      errorMessage: 'Не удалось удалить запись из базы данных.',
    });
  }
});

router.get('/:id/edit', async (req, res) => {
  const entry = await Entry.findOne({ where: { id: req.params.id } });

  const editEntry = React.createElement(EditEntry, { entry });
  const html = ReactDOMServer.renderToStaticMarkup(editEntry);
  res.write('<!DOCTYPE html>');
  res.end(html);
});

module.exports = router;
