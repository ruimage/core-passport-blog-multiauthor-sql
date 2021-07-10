const router = require('express').Router();
const {Entry} = require('../db/models/');

router.get('/', async (req, res) => {
  let entries;

  try {
    entries = await Entry.findAll({order:[['id', 'DESC']]});
  } catch (error) {
    return res.render('error', {
      message: 'Не удалось получить записи из базы данных.',
      error: {}
    });
  }

  return res.render('entries/index', { entries });
});

router.post('/', async (req, res) => {
  
  try {
    const newEntry = await Entry.create({ title: req.body.title, body: req.body.body },{returning: true,plain: true});
    return res.redirect(`/entries/${newEntry.id}`);
  } catch (error) {
    res.render('error', {
      message: 'Не удалось добавить запись в базу данных.',
      error: {}
    });
  }

  return res.redirect(`/entries/${newEntry.id}`);
});

router.get('/new', (req, res) => {
  res.render('entries/new');
});

router.get('/:id', async (req, res) => {
  let entry;

  try {
    entry = await Entry.findOne({where:{id:req.params.id}});
  } catch (error) {
    return res.render('error', {
      message: 'Не удалось получить запись из базы данных.',
      error: {}
    });
  }

  return res.render('entries/show', { entry });
});

router.put('/:id', async (req, res) => {
  let entry;

  try {
    entry = await Entry.update({ title: req.body.title, body: req.body.body },{where:{id:req.params.id}, returning: true, plain: true});
  } catch (error) {
    return res.json({ isUpdateSuccessful: false, errorMessage: 'Не удалось обновить запись в базе данных.' });
  }

  return res.json({ isUpdateSuccessful: true, entryID: entry[1].id });
});

router.delete('/:id', async (req, res) => {
  try {
    await Entry.destroy({where:{id:req.params.id}});
  } catch (error) {
    return res.json({ isDeleteSuccessful: false, errorMessage: 'Не удалось удалить запись из базы данных.' });
  }

  return res.json({ isDeleteSuccessful: true });
});

router.get('/:id/edit', async (req, res) => {
  let entry = await Entry.findOne({where:{id:req.params.id}});
  res.render('entries/edit', { entry });
});

module.exports = router;
