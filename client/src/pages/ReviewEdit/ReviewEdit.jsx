import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Flash from '../../common/Flash/Flash';
import Header from '../../common/Header/Header';

export default function ReviewEdit() {
  const { id, review } = useLoaderData();
  const [value, setValue] = useState(review);
  const [msg, setMsg] = useState(null);
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(true);

  async function handleUpdate() {
    setDisableUpdateBtn(true);

    const request = await fetch('/update-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, 'review': value }),
    });
    const response = await request.json();

    return setMsg(response.msg);
  }
  
  function handleValue(e) {
    if (msg) {
      setMsg(null);
    }
    if (disableUpdateBtn) setDisableUpdateBtn(false);
    setValue(e)
  }
  
  function UpdateButton() {
    if (disableUpdateBtn) {
      return <button disabled>Update Review</button>
    } else {
      return <button onClick={handleUpdate}>Update Review</button>
    }
  }

  return (
    <div>
      {msg && <Flash msg={ msg } />}
      <Header />
      <h1>Edit Review</h1>
      <MDEditor 
        value={value} 
        onChange={ (e) => handleValue(e) } 
        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }} 
      />
      <UpdateButton />   
    </div>
  );
}