import ArtistsLinks from "@components/artists-links";
import styles from "./TrackList.module.css";

import { Button } from "@components/ui/button";
import { Track } from "@services/tracks";
import { useAudioStore } from "@stores/audio-store";
import { combineClassNames } from "@utils/style-utils";
import { formatDuration } from "@utils/time-utils";
import { ComponentProps, useEffect, useState } from "react";
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from "react-icons/tb";

type TrackListProps = ComponentProps<"ul"> & {
  tracks: Track[];
};

const TrackList = ({ tracks, ...rest }: TrackListProps) => {
  const [trackDurations, setTrackDurations] = useState<string[]>(
    tracks.map(() => "--:--")
  );

  const state = useAudioStore((state) => state);

  useEffect(() => {
    const fetchDurations = async () => {
      const durations: string[] = [];
      const audio = new Audio();
      for (const track of tracks) {
        try {
          const duration = await new Promise<number>((resolve, reject) => {
            audio.src = track.audioUrl;
            audio.addEventListener("loadedmetadata", () => {
              resolve(audio.duration);
            });
            audio.addEventListener("error", (error) => {
              reject(error);
            });
            audio.load();
          });

          durations.push(formatDuration(duration));
        } catch (error) {
          console.error(
            `Error fetching duration for track ${track.title}:`,
            error
          );
          durations.push("--:--");
        }
      }
      setTrackDurations(durations);
    };

    fetchDurations();
  }, [tracks]);

  function handleClickPlay(track: Track) {
    if (state.playlist && state.currentTrackId === track.id) {
      if (state.isPlaying) {
        state.audioElement?.pause();
      } else {
        state.audioElement?.play();
      }

      return;
    }
    if (state.playlist && state.playlist.map((t) => t.id).includes(track.id)) {
      state.setCurrentTrackId(track.id);
    } else {
      state.setPlaylist(tracks);
      state.setCurrentTrackId(track.id);
    }
    state.audioElement?.play();
  }

  return (
    <ul className={combineClassNames(styles.list, rest.className)} {...rest}>
      {tracks.map((track, index) => (
        <li key={track.slug} className={styles.item}>
          <Button
            className={styles["play-button"]}
            onClick={() => handleClickPlay(track)}
          >
            {track.id === state.currentTrackId && state.isPlaying ? (
              <TbPlayerPauseFilled />
            ) : (
              <TbPlayerPlayFilled />
            )}
          </Button>
          <span className={styles.title}>{track.title}</span>
          <ArtistsLinks artists={track.artists} />
          <span className={styles.duration}>{trackDurations[index]}</span>
        </li>
      ))}
    </ul>
  );
};

export default TrackList;
