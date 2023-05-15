import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (state) {
      return setMsg(state);
    }
  }, [state])

  function handleUsername(value) {
    if (msg) {
      setMsg(null);
    }
    setUsername(value);
  }

  function handlePassword(value) {
    if (msg) {
      setMsg(null);
    }
    setPassword(value);
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    const request = await fetch('/user-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username, password})
    });
    const response = await request.json();

    if (response.status === 'Error') {
      return setMsg(response.msg);
    }
    return navigate('/');
  }

  function Flash({ msg }) {
    return (
      <div className="flash">
        {msg}
      </div>
    )
  }

  return (
    <div>
      {msg && <Flash msg={ msg } />}
      <h1>Sign in</h1>
      <form className="sign-in-form">
        <div className="form-input-label">
          <label htmlFor="username">Sign in with account name</label>
          <input type="text" id="username" onChange={(e) => handleUsername(e.target.value)} />
        </div>
        <div className="form-input-label">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={(e) => handlePassword(e.target.value)} />
        </div>
        <button className="sign-register" onClick={(e) => handleSubmit(e)}>Sign In</button>
        <button className="sign-register" onClick={() => navigate('/register')}>Register</button>
      </form>
    </div>
  )
}
