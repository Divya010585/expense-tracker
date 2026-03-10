import React, { useState } from "react";
import Dashboard from "./Dashboard";

function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    .then(res => res.json())
    .then(data => {

      if (data.success) {
        setLoggedIn(true);
      } else {
        alert("Invalid login");
      }

    });

  };

  if (loggedIn) {
    return <Dashboard 
    logout={()=>setLoggedIn(false)} />;
  }

  return (

    <div className="container mt-5 text-center">

      <h1>Login</h1>

      <input
        className="form-control mt-3"
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
      />

      <input
        type="password"
        className="form-control mt-3"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={login}
      >
        Login
      </button>

    </div>

  );

}

export default App;