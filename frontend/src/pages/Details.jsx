import { useParams } from "react-router-dom";

function Details() {
  const { id } = useParams();

  return (
    <div>
      <h2>Anime Details</h2>
      <p>ID: {id}</p>
    </div>
  );
}

export default Details;