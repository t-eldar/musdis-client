import AudioPlayer from "@components/audio-player";
import ImageUploader from "@components/file-uploaders/image-uploader/ImageUploader";
import SignInForm from "@components/forms/sign-in-form";
import SignUpForm from "@components/forms/sign-up-form";
import Navbar from "@components/navbar/Navbar";
import { TextField } from "@components/ui/text-field";
import { FaUser } from "react-icons/fa";

const SandboxPage = () => {
  const src =
    "https://storage.googleapis.com/musdis-6b5bf.appspot.com/audio/Alex%20G%20-%20Race.mp3";

  const navItems = [
    { icon: <FaUser />, link: "" },
    { icon: <div>icon2</div>, link: "" },
    { icon: <div>icon3</div>, onClick: () => console.log("clicked") },
  ];

  return (
    <>
      {/* <Navbar items={navItems} /> */}
      {/* <ImageUploader onSubmit={(file) => console.log(file)} /> */}
      <SignUpForm />
    </>
  );
};

export default SandboxPage;
