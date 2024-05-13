import CreateArtistForm from "@components/forms/artists/create-artist-form";
import { useNavigate } from "react-router-dom";

const CreateArtistPage = () => {
  const navigate = useNavigate();

  return <CreateArtistForm onCreated={() => navigate("/profile")} />;
};

export default CreateArtistPage;
