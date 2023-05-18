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

    const request = await fetch('/api/review/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, 'review': value }),
    });
    if (request.ok) {
      const response = await request.text();
      return setMsg(response);
    } else {
      const response = await request.text();
      console.error('ReviewEdit.jsx handleUpdate error.')
      return setMsg(response)
    }
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