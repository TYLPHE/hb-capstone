import { useParams } from "react-router-dom";

export default function GameDetails() {
  const { id } = useParams()
  console.log(id)
  return (
    <div>This is the game details</div>
  );
}