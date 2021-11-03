const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const { generateFile } = require("./generateFile");

const { addJobToQueue } = require("./jobQueue");
const Job = require("./models/Job");

mongoose.connect("mongodb://localhost:27017/compilerapp", (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Connected to DB successfully");
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log("Status requested", jobId);
  if (jobId == undefined) {
    return res
      .status(400)
      .json({ success: false, error: "Missing parameters" });
  }
  try {
    const job = await 
    Job.findById(jobId);
    if(job === undefined){
      res.status(404).json({success: false, error: "Invalid Job ID"});}
      return res.status(200).json({success: true, job});
  } catch (err) {
    return res.status(400).json({ success: false, error: JSON.stringify(err) });
  }
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  console.log(language, code.length);
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  let job;
  try {
    //Generate a cpp file with content from the request
    const filepath = await generateFile(language, code);

    job = await new Job({ language, filepath }).save();
    const jobId = job["_id"];
    addJobToQueue(jobId);
    console.log(job);
    res.status(201).json({ success: true, jobId });

    //Run the file and send the response
    let output;
  }catch(err){
    return res.status(500).json({success: false, err: JSON.stringify(err)} )
  }

});
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
