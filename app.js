require('@babel/register');

const ReactDOMServer = require('react-dom/server');
const React = require('react');

const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');

// Импортируем созданный в отдельный файлах рутеры.
const indexRouter = require('./routes/index');
const entriesRouter = require('./routes/entries');
const Error = require('./views/Error');

const app = express();
const PORT = 3000;

// Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на
// сервер в консоль выводилась информация об этом запросе.
app.use(logger('dev'));
// Подключаем middleware, которое сообщает epxress, что в папке "ПапкаПроекта/public" будут
// находится статические файлы, т.е.файлы доступные для скачивания из других приложений.
app.use(express.static(path.join(__dirname, 'public')));
// Подключаем middleware, которое позволяет читать содержимое body из HTTP-запросов
// типа POST, PUT и DELETE.
app.use(express.urlencoded({ extended: true }));
// Подключаем middleware, которое позволяет читать переменные JavaScript, сохранённые
// в формате JSON в body HTTP - запроса.
app.use(express.json());

app.use('/', indexRouter);
app.use('/entries', entriesRouter);

// Если HTTP-запрос дошёл до этой строчки, значит ни один из ранее встречаемых рутов не ответил
// на запрос.Это значит, что искомого раздела просто нет на сайте.Для таких ситуаций используется
// код ошибки 404. Создаём небольшое middleware, которое генерирует соответствующую ошибку.
app.use((req, res, next) => {
  const error = createError(404, 'Запрашиваемой страницы не существует на сервере.');
  next(error);
});

// Отлавливаем HTTP-запрос с ошибкой и отправляем на него ответ.
app.use((err, req, res) => {
  // Получаем текущий ражим работы приложения.
  const appMode = req.app.get('env');
  // Создаём объект, в котором будет храниться ошибка.
  let error;

  // Если мы находимся в режиме разработки, то отправим в ответе настоящую ошибку.
  // В противно случае отправим пустой объект.
  if (appMode === 'development') {
    error = err;
  } else {
    error = {};
  }

  // Записываем информацию об ошибке и сам объект ошибки в специальные переменные,
  // доступные на сервере глобально, но только в рамках одного HTTP - запроса.
  res.locals.message = err.message;
  res.locals.error = error;

  // Задаём в будущем ответе статус ошибки. Берём его из объекта ошибки, если он там есть.
  // В противно случае записываем универсальный стату ошибки на сервере - 500.
  res.status(err.status || 500);
  // Ренедрим React-компонент Error и отправляем его на клиент в качестве ответа.
  const errorPage = React.createElement(Error, res.locals);
  const html = ReactDOMServer.renderToStaticMarkup(errorPage);
  res.write('<!DOCTYPE html>');
  res.end(html);
});

app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}`);
});
