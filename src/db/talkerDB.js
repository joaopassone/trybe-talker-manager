const connection = require('./connection');

const selectAll = () => connection.execute(
    'SELECT id, name, age, talk_watched_at as watchedAt, talk_rate AS rate FROM talkers',
  );

module.exports = {
  selectAll,
};
