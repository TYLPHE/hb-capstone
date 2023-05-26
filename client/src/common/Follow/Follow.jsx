// Params need: followed, library_id, library_name
import { useState } from "react"

export default function FollowBtn(params) {
  const { followed, library_id, library_name } = params
  const [followBool, setFollowBool] = useState(followed)
  const [disableBtn, setDisableBtn] = useState(false)

  async function handleFollow() {
    setDisableBtn(true)
    const request = await fetch('/api/follow/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'library_id': library_id })
    })
    if (request.ok) {
      setFollowBool(true)
    }
    setDisableBtn(false)
  }
  
  async function handleUnfollow() {
    setDisableBtn(true)
    const request = await fetch('/api/follow/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'library_id': library_id })
    })
    if (request.ok) {
      setFollowBool(false)
    }
    setDisableBtn(false)
  }
  
  if (followBool) {
    return <button className="unfollowed" onClick={handleUnfollow} disabled={disableBtn}>
      {`Unfollow ${library_name}`}
    </button>
  } else {
    return <button onClick={handleFollow} disabled={disableBtn}>
      {`Follow ${library_name}`}
    </button>
  }
}