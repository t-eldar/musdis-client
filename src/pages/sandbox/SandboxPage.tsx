/* eslint-disable @typescript-eslint/no-unused-vars */
// import AudioPlayer from "@components/audio-player";
// import AudioPlayer from "@components/audio-player";
import AudioPlayer from "@components/audio-player/";
import ImageUploader from "@components/file-uploaders/image-uploader/ImageUploader";
import CreateArtistForm from "@components/forms/create-artist-form";
import SignInForm from "@components/forms/sign-in-form";
import SignUpForm from "@components/forms/sign-up-form";
import Navbar from "@components/navbar/Navbar";
import Button from "@components/ui/button";
import Select from "@components/ui/select";
import { TextField } from "@components/ui/text-field";
import { useAwait } from "@hooks/use-await";
import apiClient from "@services/base";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

const SandboxPage = () => {
  // const { promise, isLoading, error } = useAwait(
  //   async () => await apiClient.get("music-service/tracks")
  // );
  // useEffect(() => {
  //   promise();
  // }, []);

  const test =
    "https://storage.googleapis.com/musdis-6b5bf.appspot.com/audio/Alex%20G%20-%20Race.mp3";

  const navItems = [
    { icon: <FaUser />, link: "" },
    { icon: <div>icon2</div>, link: "" },
    { icon: <div>icon3</div>, onClick: () => console.log("clicked") },
  ];

  const release = {
    name: "Race",
    slug: "race",
    coverUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhkT6lwETJo3LmgUIRlys8DlOnVxnZ0hIJlY03jnawwQ&s",
    artists: [{ name: "Alex G" }],
    tracks: [
      {
        index: 0,
        coverUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhkT6lwETJo3LmgUIRlys8DlOnVxnZ0hIJlY03jnawwQ&s",
        title: "Race",
        slug: "race",
        audioUrl:
          "https://storage.googleapis.com/musdis-6b5bf.appspot.com/audio/Alex%20G%20-%20Race.mp3",
        tags: [{ name: "indie" }],
        artists: [{ name: "Alex G" }],
        author: "Alex G",
      },
      {
        index: 1,
        title: "Cross country",
        slug: "cross_country",
        coverUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhkT6lwETJo3LmgUIRlys8DlOnVxnZ0hIJlY03jnawwQ&s",

        audioUrl:
          "https://firebasestorage.googleapis.com/v0/b/musdis-6b5bf.appspot.com/o/audio%2FAlex%20G%20-%20Cross%20Country.mp3?alt=media&token=5879359f-c14d-40d0-a962-23023300d745",
        tags: [{ name: "indie" }],
        author: "Alex G",
        artists: [{ name: "Alex G" }],
      },
      {
        index: 2,
        title: "Time space",
        slug: "time_space",
        coverUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhkT6lwETJo3LmgUIRlys8DlOnVxnZ0hIJlY03jnawwQ&s",

        audioUrl:
          "https://firebasestorage.googleapis.com/v0/b/musdis-6b5bf.appspot.com/o/audio%2FAlex%20G%20-%20Time_Space.mp3?alt=media&token=4d3b2b01-5527-465d-bb49-f9042fc585c4",
        tags: [{ name: "indie" }],
        author: "Alex G",
        artists: [{ name: "Alex G" }],
      },
    ],
  };
  const [src, setSrc] = useState(release.tracks[0].audioUrl);
  const [currentSong, setCurrentSong] = useState(release.tracks[0]);

  return (
    <>
      {/* <div>error: {error.hasOwnProperty("message")}</div> */}
      {/* <div>Loading: {isLoading.toString()}</div> */}
      <SignUpForm />
    </>
  );
};

export default SandboxPage;
