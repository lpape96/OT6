async function getAllUserRes(req, res) {
  const ert = { res: 'hello' };
  // Regarder les fichiers et regarder si user_1 est créé
  res.json(ert);
}

async function addUserInfo(req, res) {
  // Ask python pour les calculs des fichiers
  console.log('in it');
}

module.exports = {
  getAllUserRes,
  addUserInfo,
};
