const express = require('express');
const randomToken = require('random-token');
const talkerFs = require('./talkerFs');
const loginValidation = require('./loginValidation');
const { tokenValidation, nameValidation, ageValidation,
  talkValidation, watchedAtValidation, rateValidation } = require('./talkerValidation');
const { rateSearchValidation } = require('./searchValidation');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const result = await talkerFs.findAll();
  res.status(200).json(result);
});

app.get('/talker/search/', tokenValidation, rateSearchValidation, async (req, res) => {
  const { q, rate } = req.query;
  const filteredByQ = await talkerFs.findByQ(q);
  const result = await talkerFs.findByRate(filteredByQ, +rate);
  res.status(200).json(result);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const result = await talkerFs.findById(+id);
  if (result) return res.status(200).json(result);
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', loginValidation, async (_req, res) => {
  const token = randomToken(16);
  res.status(200).json({ token });
});

app.post('/talker', tokenValidation, nameValidation, ageValidation,
  talkValidation, watchedAtValidation, rateValidation, async (req, res) => {
  const { body } = req;
  const result = await talkerFs.addTalker(body);
  res.status(201).json(result);
});

app.put('/talker/:id', tokenValidation, nameValidation, ageValidation,
  talkValidation, watchedAtValidation, rateValidation, async (req, res) => {
  const { body, params } = req;
  const { id } = params;
  const result = await talkerFs.updateTalker(+id, body);

  if (result) {
    return res.status(200).json(result);
  }
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  const { id } = req.params;
  const response = await talkerFs.deleteTalker(+id);
  console.log(response);
  if (response) return res.status(204).json();
  res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.listen(PORT, () => {
  console.log('Online');
});
