import { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Header from '../../common/Header/Header'


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
  
  const [inLibrary, setInLibrary] = useState(in_library);
  const [AddBtnTxt, setAddBtnTxt] = useState('Add to library');

  async function handleAdd() {
    setInLibrary(true);
    setAddBtnTxt('Adding...');

    const request = await fetch('/api/add-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (request.ok) {
      const response = await request.text();
      return setAddBtnTxt(response);
    } 
    else {
      const response = await request.text();
      return console.error(response)
    }
  }

  function AddBtn() {
    return <button onClick={handleAdd}>{AddBtnTxt}</button>;
  }

  function AddBtnDisabled() {
    return <button disabled>Added to library</button>;
  }

  return (
    <div style={ { backgroundImage: background } }>
      <Header />
      <div className="main-view">
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
      </div>
    </div>
  );
}