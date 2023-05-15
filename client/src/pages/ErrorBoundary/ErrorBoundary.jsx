import { useRouteError } from "react-router-dom"
export default function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  console.log('errorlog', error)
  // Uncaught ReferenceError: path is not defined
  return (
    <div>
      Error.
      <div>
        Note to self: Don't forget to "python3 server.py"
      </div>
    </div>
  );
}
