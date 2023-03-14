const express = require('express');
const talkerFs = require('./talkerFs');

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
  res.status(200).json(result || []);
});

app.listen(PORT, () => {
  console.log('Online');
});
