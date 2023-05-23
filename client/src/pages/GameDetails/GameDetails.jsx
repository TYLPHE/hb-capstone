import { useState, useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";

export default function GameDetails() {
  const { id } = useParams();
  const {
    background,
    header_image,
    in_library,
    name,
    release_date,
    short_description,
  } = useLoaderData();

  const [inLibrary, setInLibrary] = useState(null);
  const [AddBtnTxt, setAddBtnTxt] = useState('Add to library');
  
  useEffect(() => {
    setInLibrary(in_library)
  }, [in_library])

  useEffect(() => {
    const root = document.querySelector('#root');
    root.style.backgroundImage = `url(${background})`;
  }, [background]);
  
  // BUG FIX FOR WHITE BACKGROUNDS (404 background)
  // useEffect(() => {
  //   const root = document.querySelector('#root');
  //   (async ()=> {
  //     const request = await fetch(`/api/games/checkbg?url=${background}`);
  //     if (request.ok) {
  //         root.style.backgroundImage = `url(${background})`;
  //       } else {
  //         root.style.backgroundImage = null;
  //       }
  //   })()
  // }, [background]);

  useEffect(() => {
    return () => {
      const root = document.querySelector('#root');
      root.style.backgroundImage = null;
    }
  }, []);
  
  async function handleAdd() {
    setAddBtnTxt('Adding...');

    const request = await fetch('/api/library-game/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (request.ok) {
      const response = await request.text();
      setInLibrary(true);
      return setAddBtnTxt(response);
    } 
    else {
      const response = await request.text();
      setAddBtnTxt('Add to library')
      return console.error(response)
    }
  }

  function AddBtn() {
    return <button onClick={handleAdd}>{AddBtnTxt}</button>;
  }

  function AddBtnDisabled() {
    return <button disabled>Added to library</button>;
  }

  return <>
    <h1>{ name }</h1>
    
    <div>
      <img src={ header_image } alt="Game header"/>
    </div>
    
    <div>
      <p>{ short_description }</p>
      <p>Release Date: { release_date }</p>
    </div>

    <div>
      {inLibrary ? <AddBtnDisabled /> : <AddBtn />}
    </div>
  </>
}