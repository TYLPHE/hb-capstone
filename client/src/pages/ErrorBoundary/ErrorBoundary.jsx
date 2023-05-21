import { useRouteError } from "react-router-dom"
export default function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <>
    Error.
    <ul>
      <li>Note to self: Don't forget to "python3 server.py"</li>
    </ul>
  </>
}
