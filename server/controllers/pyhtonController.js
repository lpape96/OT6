const askPython = (fichier, noeudD, noeudA) => {
  return new Promise((res, err) => {
    const { execFile } = require('child_process');
    const pyProg = execFile(
      'python',
      ['server/pythonCode/Dijkstra.py', fichier, noeudD, noeudA],
      (error, stdout, stderr) => {
        if (stderr) {
          res(stderr);
        } else {
          res(stdout);
        }
      }
    );
  });
};

module.exports = {
  askPython,
};
