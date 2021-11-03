const { exec } = require("child_process");

const executePy = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`python ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject({ stderr });
      resolve(stdout);
      // if(error)
      //   {
      //     console.log(`exec error: ${error}`);
      //     return;
      //   }
      //   console.log(`stdout: ${stdout}`);
      //   console.error(`stderr: ${stderr}`);
    });
  });
};

module.exports = {
  executePy,
};
