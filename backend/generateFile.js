const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}
//use ; instead of && in Powershell
//if the codes folder doesn't exists, recreate it
const generateFile = async (format, content) => {
  const jobId = uuid();
  const fileName = `${jobId}.${format}`;
  const filepath = path.join(dirCodes, fileName);
  await fs.writeFileSync(filepath, content);
  // console.log(filepath)
  return filepath;
};

module.exports = { generateFile };
