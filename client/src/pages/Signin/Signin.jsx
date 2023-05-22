import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import Flash from "../../common/Flash/Flash";
import Footer from '../../common/Footer/Footer'
import './Signin.css';

export default function Signin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (state) {
      setMsg(state);
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

    const request = await fetch('/api/user/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (request.ok) {
      return navigate('/dashboard');
    }
    else if (request.status === 401) {
      const response = await request.text();
      return setMsg(response);
    }
    else {
      return console.error('fetch("/api/user/signin") error');
    }
  }

  return <>
    {msg && <Flash msg={ msg } />}
    
    <h1>Sign in</h1>
    
    <form className="signin-form">
      <div className="form-input-label">
        <label htmlFor="username">Sign in with account name</label>
        <input type="text" id="username" onChange={(e) => handleUsername(e.target.value)} />
      </div>
      
      <div className="form-input-label">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" onChange={(e) => handlePassword(e.target.value)} />
      </div>
      
      <div className="signin-button-container">
        <button className="sign-register" onClick={(e) => handleSubmit(e)}>Sign In</button>
        <button className="sign-register" onClick={() => navigate('/register')}>Register</button>
      </div>
    </form>
    <Footer />
  </>
}
