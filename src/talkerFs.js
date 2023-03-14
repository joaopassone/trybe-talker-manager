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

module.exports = {
  findAll,
  findById,
};
