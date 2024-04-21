import styles from "./Controls.module.css";
import {
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import { Button } from "@components/ui/button";
import { combineClassNames } from "@utils/style-utils";
import { IconContext } from "react-icons/lib";
import { ComponentProps } from "react";
import { useAudioPlayerContext } from "@components/audio-player/context";

type ControlsProps = ComponentProps<"div">;
const Controls = (props: ControlsProps) => {
  const context = useAudioPlayerContext();
  if (!context) {
    throw new Error(
      "Cannot use this component: AudioPlayerContext is null. Please use it inside the AudioPlayer.Root component."
    );
  }

  return (
    <div className={props.className || styles.container} {...props}>
      <Button
        className={styles["skip-button"]}
        onClick={context.handleClickPrevious}
      >
        <TbPlayerSkipBackFilled />
      </Button>
      <Button
        className={combineClassNames(
          styles["play-button"],
          context.isPlaying ? styles["playing"] : ""
        )}
        onClick={context.handleTogglePlayPause}
      >
        <IconContext.Provider
          value={{ className: styles["icon"], size: "1.5rem" }}
        >
          {!context.isPlaying ? (
            <TbPlayerPlayFilled />
          ) : (
            <TbPlayerPauseFilled />
          )}
        </IconContext.Provider>
      </Button>
      <Button
        className={styles["skip-button"]}
        onClick={context.handleClickNext}
      >
        <TbPlayerSkipForwardFilled />
      </Button>
    </div>
  );
};

export default Controls;
