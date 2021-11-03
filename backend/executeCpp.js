const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");


const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

//filepath: P:\WebDev-projects\OnlineJudge\backend\codes\4094323e-4da3-4957-b5b8-5de4fa9d5b53.cpp
const executeCpp = (filepath) => {

  //COnsider the filename is 8932470283-dfjhv-234v3-4r234fc3.cpp, here we split the strings
  //we take the first half before the fullstop, using split

  const jobId = path.basename(filepath).split(".")[0]; //jobId: 4094323e-4da3-4957-b5b8-5de4fa9d5b53
  const outPath = path.join(outputPath, `${jobId}.exe`); //P:\WebDev-projects\OnlineJudge\backend\outputs\4094323e-4da3-4957-b5b8-5de4fa9d5b53.exe
  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}`,(error, stdout, stderr) => {
          error && reject({error, stderr});
          stderr && reject({stderr});
          resolve(stdout)
          // if(error)
          //   {
          //     console.log(`exec error: ${error}`);
          //     return;
          //   }
          //   console.log(`stdout: ${stdout}`);
          //   console.error(`stderr: ${stderr}`);
   
      }
    );
  });
};

module.exports = {
  executeCpp,
};
