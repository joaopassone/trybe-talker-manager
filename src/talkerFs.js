const fs = require('fs').promises;

const readFile = async () => {
  const result = await fs.readFile(`${__dirname}/talker.json`, 'utf-8');
  return JSON.parse(result);
};

const findAll = async () => readFile();

const findById = async (talkerId) => {
  const talkers = await readFile();
  const result = talkers.find(({ id }) => id === talkerId);
  return result;
};

const addTalker = async (talker) => {
  const talkers = await readFile();
  const ids = talkers.map(({ id }) => id);
  const id = Math.max(...ids) + 1;
  talkers.push({ id, ...talker });
  await fs.writeFile(`${__dirname}/talker.json`, JSON.stringify(talkers, null, 2));
  return { id, ...talker };
};

const updateTalker = async (id, talker) => {
  const talkers = await readFile();
  const index = talkers.findIndex(({ id: updatedId }) => updatedId === id);

  if (index !== -1) {
    talkers.splice(index, 1, { id, ...talker });
    await fs.writeFile(`${__dirname}/talker.json`, JSON.stringify(talkers, null, 2));
    return { id, ...talker };
  }
};

const deleteTalker = async (id) => {
  const talkers = await readFile();
  const index = talkers.findIndex(({ id: deleteId }) => deleteId === id);

  if (index !== -1) {
    talkers.splice(index, 1);
    await fs.writeFile(`${__dirname}/talker.json`, JSON.stringify(talkers, null, 2));
    return true;
  }
};

const findByQ = async (searchTerm) => {
  const talkers = await readFile();
  if (!searchTerm) return talkers;
  const result = talkers
    .filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()));
  return result;
};

const findByRate = async (talkers, rate) => {
  if (!rate) return talkers;
  const result = talkers
    .filter((talker) => talker.talk.rate === rate);
  return result;
};

module.exports = {
  findAll,
  findById,
  addTalker,
  updateTalker,
  deleteTalker,
  findByQ,
  findByRate,
};
