const fs = require('fs').promises;

const findAll = async () => {
  const result = await fs.readFile(`${__dirname}/talker.json`, 'utf-8');
  return JSON.parse(result);
};

const findById = async (talkerId) => {
  const talkers = await fs.readFile(`${__dirname}/talker.json`, 'utf-8');
  const result = JSON.parse(talkers).find(({ id }) => id === talkerId);
  return result;
};

const addTalker = async (talker) => {
  const talkersJson = await fs.readFile(`${__dirname}/talker.json`, 'utf-8');
  const talkers = JSON.parse(talkersJson);
  const ids = talkers.map(({ id }) => id);
  const id = Math.max(...ids) + 1;
  talkers.push({ id, ...talker });
  await fs.writeFile(`${__dirname}/talker.json`, JSON.stringify(talkers, null, 2));
  return { id, ...talker };
};

const updateTalker = async (id, talker) => {
  const talkersJson = await fs.readFile(`${__dirname}/talker.json`, 'utf-8');
  const talkers = JSON.parse(talkersJson);
  const index = talkers.findIndex(({ id: updatedId }) => updatedId === id);

  if (index !== -1) {
    talkers.splice(index, 1, { id, ...talker });
    await fs.writeFile(`${__dirname}/talker.json`, JSON.stringify(talkers, null, 2));
    return { id, ...talker };
  }
};

module.exports = {
  findAll,
  findById,
  addTalker,
  updateTalker,
};
