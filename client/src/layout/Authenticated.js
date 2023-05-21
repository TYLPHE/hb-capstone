import { Outlet } from "react-router-dom";
import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";


export default function Authenticated() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}