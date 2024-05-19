import styles from "./CreateArtistPage.module.css";

import { CreateArtistForm } from "@components/forms/artists/create-artist-form";
import { useNavigate } from "react-router-dom";

const CreateArtistPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Start sharing your own music!</h1>
      <CreateArtistForm className={styles.form} onCreated={() => navigate("/profile")} />
    </div>
  );
};

export default CreateArtistPage;
