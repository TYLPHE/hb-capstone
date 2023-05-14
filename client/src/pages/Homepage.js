import {useState} from 'react'

function App() {
  const [test, setTest] = useState(null);
  const [test1, setTest1] = useState(null);

  async function getData() {
    const res = await fetch('/data');
    const data = await res.json()
    console.log('data', data)
    setTest(data)
  }

  async function getData1() {
    const res = await fetch('/data1');
    const data = await res.json();
    console.log('data1', data)
    setTest1(data)
  }
  
  return (
    <div>
        <div>
          <button onClick={getData}>click for data</button>
          {test && <div>
              <p>{test.name}</p>
              <p>{test.test}</p>
            </div>}
        </div>
        <div>
          <button onClick={getData1}>click for data</button>
          {test1 && <div>
              <p>{test1.fname}</p>
              <p>{test1.username}</p>
            </div>}
        </div>
        <div>
          <a href='http://localhost:5000/games'>
            <button>click for homepage</button>
          </a>
        </div>
        <div>
          <a href='/register'>
            <button>click to register</button>
          </a>
        </div>
    </div>
  );
}

export default App;
