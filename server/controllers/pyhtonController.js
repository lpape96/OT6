const askPython = (nameFile) => {
  return new Promise((res, err) => {
    const { execFile } = require('child_process');
    const pyProg = execFile(
      'python',
      [`../notebooks/exe.py`, nameFile, 0],
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
