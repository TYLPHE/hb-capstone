import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Flash from "../../common/Flash/Flash";
import './Register.css'

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

    if (username.length < 3 || password.length < 3) {
      setMsg('Account name and password needs to be at least 3 characters')
    } else {
      const request = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fname, lname, })
      });
      if (request.ok) {
        const response = await request.text();
        return navigate('/signin', { state: response })
      }
      else if (request.status === 400) {
        const response = await request.text();
        return setMsg(response);
      }
      return console.error('Register submit error.')
    }
  }
  
  return (
    <div>
      {msg && <Flash msg={ msg }/>}
      <h1>Create your account</h1>
      <form className="signin-form">
        <div className="form-input-label">
          <label htmlFor="username">Account name</label>
          <input type="text" id="username" onChange={(e) => handleUsername(e.target.value)} />
        </div>
        <div className="form-input-label">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={(e) => handlePassword(e.target.value)} />
        </div>
        <div className="form-input-label">
          <label htmlFor="fname">First name</label>
          <input type="text" id="fname" onChange={(e) => handleFname(e.target.value)} />
        </div>
        <div className="form-input-label">
          <label htmlFor="lname">Last name</label>
          <input type="text" id="lname" onChange={(e) => handleLname(e.target.value)} />
        </div>
        <div className="signin-button-container">
          <button className="create-account" onClick={(e) => handleSubmit(e)}>Create Account</button>
        </div>
      </form>
    </div>
  )
}
