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
  console.log('innnn');
  await pythonController.askPython(nameFile);
  console.log('python');
  // const nameFileRes = 'res_' + nameFile;
  // const dataRes = [];
  // fs.createReadStream(`../notebooks/poi/${nameFileRes}`)
  //   .on('error', (err) => {
  //     res.status(500).send(err);
  //   })
  //   .pipe(csv())
  //   .on('data', (row) => {
  //     let latLong = row.Center.split(',');
  //     let lat = latLong[0].substring(1);
  //     let long = latLong[1].substring(1, latLong[1].length - 1);
  //     dataRes.push({ lat, long });
  //   })
  //   .on('end', () => {
  //     res.send(dataRes);
  //   });
}

module.exports = {
  getAllUserRes,
  addUserInfo,
};
