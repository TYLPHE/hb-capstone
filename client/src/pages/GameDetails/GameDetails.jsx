import { useState } from "react";
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
  const [inLibrary, setInLibrary] = useState(in_library);
  const [AddBtnTxt, setAddBtnTxt] = useState('Add to library');

  async function handleAdd() {
    setInLibrary(true);
    setAddBtnTxt('Adding...');
    const request = await fetch('/add-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const response = await request.json();
    if (response.status === 'Success') {
      return setAddBtnTxt('Added to library');
    }
    return;
  }

  function AddBtn() {
    return <button onClick={handleAdd}>{AddBtnTxt}</button>;
  }

  function AddBtnDisabled() {
    return <button disabled>Added to library</button>;
  }

  return (
    <div style={ { backgroundImage: background } }>
      <h1>{ name }</h1>
      <img src={ header_image } alt="Game header"/>
      <div>
        <p>{ short_description }</p>
        <p>Release Date: { release_date }</p>
      </div>
      {inLibrary ? <AddBtnDisabled /> : <AddBtn />}
    </div>
  );
}