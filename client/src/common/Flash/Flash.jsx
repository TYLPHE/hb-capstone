/* Flash component adds a message at the top of the user's viewport
 * Add the lines below in addition to importing the component:
 * 
 * Define State:
 * const [msg, setMsg] = useState(null)
 * 
 * Add component to return statement:
 * {msg && <Flash msg={ msg }/>}
 */

import './Flash.css';

export default function Flash({ msg }) {
  return (
    <div className="flash">
      {msg}
    </div>
  )
}