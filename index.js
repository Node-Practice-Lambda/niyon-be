require('dotenv').config();
const NiyonDB = require('./conn');
const server = require('./server');

const PORT = process.env.PORT || 5000;

const serverVar = server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

function sum(...numbers) {
  // eslint-disable-next-line no-restricted-globals
  if (numbers.every(n => typeof n === 'number' && !isNaN(n))) {
    return numbers.reduce((acc, item) => acc + item, 0);
  }
  throw Error('Contains invalid number');
}

// Check if DB works
async function checkDB() {
  try {
    await NiyonDB.authenticate();
    return 'Success';
  } catch (error) {
    return 'Failed';
  }
}

module.exports = {
  sum,
  checkDB,
  serverVar
};
