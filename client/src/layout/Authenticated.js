import { Outlet } from "react-router-dom";
import Header from "../common/Header/Header";


export default function Authenticated() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}