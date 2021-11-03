import "./App.css";
import React, { useState } from "react";
import axios from "axios";
function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      const { data } = await axios.post("http://localhost:5000/run", payload);
      setOutput(data.output);
    } catch ({response}) {
      if(response){
        const errorMsg = response.data.err.stderr;
        setOutput(errorMsg);
        console.log(response);
      } else{
       setOutput("Error connection to the Server :(");}
    }
  };
  return (
    <div className="App">
      <h1>Online Judge</h1>
      <div>
        <label>Select Language: </label>
        <select
          value={language}
          onChange={(e)=>{
            setLanguage(e.target.value);
            console.log(e.target.value);
          }}>
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <br/>
      <textarea
        rows="50"
        cols=" 100"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Submit</button>

      <p>{output}</p>
    </div>
  );
}

export default App;
