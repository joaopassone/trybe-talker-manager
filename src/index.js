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

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const result = await talkerFs.findById(+id);
  if (result) return res.status(200).json(result);
  res.status(404).json({ message: "Pessoa palestrante não encontrada" });
})

app.listen(PORT, () => {
  console.log('Online');
});
