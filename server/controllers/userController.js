const fs = require('fs');
const csv = require('csv-parser');
const pythonController = require('./pyhtonController');

async function getAllUserRes(req, res) {
  const nameFile = req.body.filename;
  const nameFileRes = 'res_' + nameFile;
  fs.createReadStream(nameFileRes)
    .pipe(csv())
    .on('data', (row) => {
      console.log(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

async function addUserInfo(req, res) {
  const nameFile = req.body.filename;
  let imageFile = req.files.file;

  imageFile.mv(`../notebooks/poi/${nameFile}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
  });
  const res = await pythonController.askPython(nameFile);
  if (res === 1) {
    fs.readFile(`../notebooks/poi/${nameFile}`, (err, data) => {
      if (err) {
        console.error(err);
      }
      const value = data;
      res.send(value);
    });
  }
}

module.exports = {
  getAllUserRes,
  addUserInfo,
};
