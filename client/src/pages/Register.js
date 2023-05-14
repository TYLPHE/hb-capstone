export default function Register() {
  function handleUsername() {
    return
  }
  function handlePassword() {
    return 
  }
  function handleSubmit() {
    return 
  }
  
  return (
    <div>
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
        <button onClick={(e) => handleSubmit(e)}>Create Account</button>
      </form>
    </div>
  )
}
