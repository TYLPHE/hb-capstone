import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [fname, setFname] = useState(null);
  const [lname, setLname] = useState(null);
  const [msg, setMsg] = useState(null)

  function handleUsername(value) {
    if (msg) {
      setMsg(null)
    }

    return setUsername(value);
  }

  function handlePassword(value) {
    if (msg) {
      setMsg(null)
    }
    
    return setPassword(value);
  }

  function handleFname(value) {
    if (msg) {
      setMsg(null)
    }
    
    return setFname(value);
  }

  function handleLname(value) {
    if (msg) {
      setMsg(null)
    }
    
    return setLname(value);
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const request = await fetch('/user-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, fname, lname })
    });
    const response = await request.json();
    if (response.status === 'Error') {
      return setMsg(response.msg);
    }
    else if (response.status === 'Success') {
      return navigate('/login', { state: response.msg })
    }
    else return;
  }
  
  function Flash({ msg }) {
    return (
      <div>
        {msg}
      </div>
    )
  }
  
  return (
    <div>
      {msg && <Flash msg={ msg }/>}
      <h1>Create your account</h1>
      <form>
      <div>
          <label htmlFor="username">Sign in with account name</label>
          <input type="text" id="username" onChange={(e) => handleUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={(e) => handlePassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="fname">First name</label>
          <input type="fname" id="fname" onChange={(e) => handleFname(e.target.value)} />
        </div>
        <div>
          <label htmlFor="lname">Last name</label>
          <input type="lname" id="lname" onChange={(e) => handleLname(e.target.value)} />
        </div>
        <button onClick={(e) => handleSubmit(e)}>Create Account</button>
      </form>
    </div>
  )
}
