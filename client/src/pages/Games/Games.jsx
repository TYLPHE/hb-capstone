import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom"
import Flash from "../../common/Flash/Flash";
import Header from '../../common/Header/Header';
import Search from "../../common/Search/Search";

export default function Games() {
  const random_games = useLoaderData();
  const [msg, setMsg] = useState(null);

  return (
    <div>
      <Header />
      { msg && <Flash msg={msg}/> }

      <h1>Browse Games</h1>
      <div>
        <Search msg={msg} setMsg={setMsg} />
        <h2>Random Games</h2>
        <div>
          {random_games.map((game) => {
            return (
              <div key={game.id}>
                <Link to={`/games/${game.id}/${game.name}`}>
                  <img src={game.header_image} alt='Header of game' />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}