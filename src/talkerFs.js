const fs = require('fs').promises;

const findAll = async () => {
  const result = await fs.readFile(`${__dirname}/talker.json`, 'utf-8');
  return JSON.parse(result);
};

module.exports = {
  findAll,
};
