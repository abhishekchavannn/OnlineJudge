import "./App.css";
import React, { useState, useEffect} from "react";
import axios from "axios";
import stubs from "./defaultStubs";
import moment from 'moment';
function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(()=>{
    const defaultLang = localStorage.getItem("default-language") || "cpp"
    setLanguage(defaultLang);
  },[])
  useEffect(()=>{
    setCode(stubs[language]);
  },[language])

 
  const setDefaultLanguage = () =>{
    localStorage.setItem("default-language", language);
    console.log(`${language} is set as a default language!`)
  }

  const renderTimedetails = () =>{
    if(!jobDetails)
      return "";

      let result = '';
      let {sumbittedAt, completedAt, startedAt} = jobDetails;
     
      sumbittedAt = moment(sumbittedAt).toString()
      result += `Submitted At: ${sumbittedAt}`;
      if(!completedAt || !startedAt){
        return result;
      }
      const start = moment(startedAt);
      const end = moment(completedAt);
      const execTime = end.diff(start, 'seconds', true);
      result += ` Execution Time: ${execTime} s`;

      return result;
    // return JSON.stringify(jobDetails);
  }


  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setJobId("");
      setStatus("");
      setOutput("");
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      console.log(data);
      setJobId(data.jobId);

      let intervalId;
      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          "http://localhost:5000/status",
          { params: { id: data.jobId } }
        );
        const { success, job, error } = dataRes;
        console.log(dataRes);
        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
          setStatus(jobStatus);
          setJobDetails(job);
          if (jobStatus === "pending") return;
          setOutput(jobOutput);
          clearInterval(intervalId);
        } else {
          setStatus("Error: Please retry!");
          console.error(error);
          clearInterval(intervalId);
          setOutput(error);
        }
        console.log(dataRes);
      }, 1000);
    } catch ({ response }) {
      if (response) {
        const errorMsg = response.data.err.stderr;
        setOutput(errorMsg);
        console.log(response);
      } else {
        setOutput("Error connection to the Server :(");
      }
    }
  };
  return (
    <div className="App">
      <h1>Online Judge</h1>
      <div>
        <label>Select Language: </label>
        <select
          value={language}
          onChange={(e) => {
            let response = window.confirm(
              "WARNING! Switching to other language will result in loss of code, Do want us to switch?"
            );
            if(response)
            setLanguage(e.target.value);
            // console.log(e.target.value);
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <br/>
      <div>
        <button onClick={setDefaultLanguage}>Set Default</button> 
      </div>
      <br />
      <textarea
        rows="50"
        cols=" 100"
        placeholder="Write your code here"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <p>{status}</p>
      <p>{jobId && `JobID: ${jobId}`}</p>
      <p>{renderTimedetails()}</p>
      
      <p>{output}</p>
    </div>
  );
}

export default App;
