const express = require('express');
const randomToken = require('random-token');
const functions = require('./functions');
const loginValidation = require('./middlewares/loginValidation');
const { tokenValidation, nameValidation, ageValidation, talkValidation, watchedAtValidation,
  rateValidation, rateChangeValidation } = require('./middlewares/talkerValidation');
const { rateSearchValidation, dateValidation } = require('./middlewares/searchValidation');
const { selectAll } = require('./db/talkerDB');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const result = await functions.findAll();
  res.status(200).json(result);
});

app.get('/talker/db', async (_req, res) => {
  const [talkers] = await selectAll();
  const result = functions.fixDataFormat(talkers);
  res.status(200).json(result);
});

app.get('/talker/search/', tokenValidation,
  rateSearchValidation, dateValidation, async (req, res) => {
  const { q, rate, date } = req.query;
  const filteredByQ = await functions.findByQ(q);
  const filteredByRate = await functions.findByRate(filteredByQ, +rate);
  const result = await functions.findByWatchedDate(filteredByRate, date);
  res.status(200).json(result);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const result = await functions.findById(+id);
  if (result) return res.status(200).json(result);
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.patch('/talker/rate/:id', tokenValidation, rateChangeValidation, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  await functions.changeRate(+id, rate);
  res.status(204).json();
});

app.post('/login', loginValidation, async (_req, res) => {
  const token = randomToken(16);
  res.status(200).json({ token });
});

app.post('/talker', tokenValidation, nameValidation, ageValidation,
  talkValidation, watchedAtValidation, rateValidation, async (req, res) => {
  const { body } = req;
  const result = await functions.addTalker(body);
  res.status(201).json(result);
});

app.put('/talker/:id', tokenValidation, nameValidation, ageValidation,
  talkValidation, watchedAtValidation, rateValidation, async (req, res) => {
  const { body, params } = req;
  const { id } = params;
  const result = await functions.updateTalker(+id, body);

  if (result) {
    return res.status(200).json(result);
  }
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  const { id } = req.params;
  const response = await functions.deleteTalker(+id);
  if (response) return res.status(204).json();
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});
