import { useState } from "react";
import { useLoaderData } from "react-router-dom";

export default function GameDetails() {
  const {
    background,
    header_image,
    in_library,
    name,
    release_date,
    short_description,
  } = useLoaderData();

  const [inLibrary, setInLibrary] = useState(in_library)

  function handleAdd() {
    setInLibrary(true)
  }

  function AddBtn() {
    return <button onClick={handleAdd}>Add to library</button>
  }

  function AddBtnDisabled() {
    return <button disabled>Added to library</button>
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