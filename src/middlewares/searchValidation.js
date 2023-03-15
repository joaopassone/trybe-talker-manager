const rateSearchValidation = (req, res, next) => {
  const { rate } = req.query;

  if (rate && (!Number.isInteger(+rate) || +rate < 1 || +rate > 5)) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  next();
};

const dateValidation = (req, res, next) => {
  const { date } = req.query;

  if (date && !date.match(/\d\d\/\d\d\/\d\d\d\d/)) {
    return res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

module.exports = {
  rateSearchValidation,
  dateValidation,
};
