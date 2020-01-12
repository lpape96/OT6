const fs = require('fs');
const csv = require('csv-parser');
const pythonController = require('./pyhtonController');

const allFiles = [
  'res_user_2',
  'res_user_6',
  'res_user_7',
  'res_user_8',
  'res_user_11',
  'res_user_14',
  'res_user_15',
  'res_user_17',
  'res_user_24',
  'res_user_26',
  'res_user_27',
  'res_user_28',
  'res_user_36',
  'res_user_38',
  'res_user_42',
  'res_user_50',
  'res_user_52',
  'res_user_55',
  'res_user_85',
];

async function getAllUserRes(req, res) {
  test().then((finalRes) => {
    res.send(finalRes);
  });
}

function test() {
  return new Promise((resolve, reject) => {
    let finalRes = [];
    allFiles.map(async (fileName) => {
      let dataLongLat = [];
      let dataOneUser = { name: fileName.substring(0, fileName.length), dataValues: dataLongLat };
      const stream = fs.createReadStream(`../notebooks/poi/${fileName}.csv`);
      const value = await readStream(stream, dataOneUser);
      finalRes.push(value);
    });
    console.log(finalRes);
    resolve(finalRes);
  });
}

function readStream(stream, dataOneUser) {
  let dataLongLat = [];
  return new Promise((resolve, reject) => {
    stream
      .on('error', () => {
        // console.log(err);
      })
      .pipe(csv())
      .on('data', (row) => {
        let latLong = row.Center.split(',');
        let lat = latLong[0].substring(1);
        let long = latLong[1].substring(1, latLong[1].length - 1);
        dataLongLat.push({ lat, long });
      })
      .on('end', () => {
        dataOneUser.dataValues = dataLongLat;
        resolve(dataOneUser);
      });
  });
}

async function addUserInfo(req, res) {
  const nameFile = req.body.filename;
  // let imageFile = req.files.file;

  // imageFile.mv(`../notebooks/poi/${nameFile}`, function(err) {
  //   if (err) {
  //     return res.status(500).send(err);
  //   }
  // });
  // await pythonController.askPython(nameFile);
  const nameFileRes = 'res_' + nameFile;
  const nameFilePoi = 'poi_' + nameFile;
  const nameFiletrace = 'trace_' + nameFile;

  const dataRes = [];
  const dataPoi = [];
  const dataTrace = [];
  fs.createReadStream(`../notebooks/poi/${nameFileRes}`)
    .on('error', (err) => {
      res.status(500).send(err);
    })
    .pipe(csv())
    .on('data', (row) => {
      let latLong = row.Center.split(',');
      let lat = latLong[0].substring(1);
      let long = latLong[1].substring(1, latLong[1].length - 1);
      dataRes.push({ lat, long });
    })
    .on('end', () => {
      fs.createReadStream(`../notebooks/poi/${nameFilePoi}`)
        .on('error', (err) => {
          res.status(500).send(err);
        })
        .pipe(csv())
        .on('data', (row) => {
          let latLong = row.Center.split(',');
          let lat = latLong[0].substring(1);
          let long = latLong[1].substring(1, latLong[1].length - 1);
          dataPoi.push({ lat, lng: long });
        })
        .on('end', () => {
          fs.createReadStream(`../notebooks/poi/${nameFiletrace}`)
            .on('error', (err) => {
              res.status(500).send(err);
            })
            .pipe(csv())
            .on('data', (row) => {
              let lat = parseFloat(row.Lat);
              let long = parseFloat(row.Long);
              dataTrace.push({ lat: lat, lng: long });
            })
            .on('end', () => {
              res.send({ res: dataRes, poi: dataPoi, trace: dataTrace });
            });
        });
    });
}

async function getCovoit(req, res) {
  const nameFile = req.query.filename;
  console.log(nameFile);
  const dataCovoit = [];
  fs.createReadStream(`../notebooks/poi/covoit_${nameFile}`)
    .on('error', (err) => {
      res.status(500).send(err);
    })
    .pipe(csv())
    .on('data', (row) => {
      let latLong = row.Center.split(',');
      let lat = latLong[0].substring(1);
      let long = latLong[1].substring(1, latLong[1].length - 1);
      dataCovoit.push({ lat: lat, lng: long });
    })
    .on('end', () => {
      res.send(dataCovoit);
    });
}

module.exports = {
  getAllUserRes,
  addUserInfo,
  getCovoit,
};
