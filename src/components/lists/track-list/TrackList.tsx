import ArtistsLinks from "@components/artists-links";
import styles from "./TrackList.module.css";

import { Button } from "@components/ui/button";
import { ReleaseTrack } from "@services/releases";
import { useAudioStore } from "@stores/audio-store";
import { combineClassNames } from "@utils/style-utils";
import { formatDuration } from "@utils/time-utils";
import { ComponentProps, useEffect, useState } from "react";
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from "react-icons/tb";

type TrackListProps = ComponentProps<"ul"> & {
  tracks: ReleaseTrack[];
  onTotalDurationChange?: (totalDuration: number) => void;
};

const TrackList = ({
  tracks,
  onTotalDurationChange,
  ...rest
}: TrackListProps) => {
  const { className, ...props } = rest;

  const [trackDurations, setTrackDurations] = useState<string[]>(
    tracks.map(() => "--:--")
  );

  const state = useAudioStore((state) => state);

  useEffect(() => {
    const fetchDurations = async () => {
      const durations: string[] = [];
      let totalDuration = 0;
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
          totalDuration += duration;
          durations.push(formatDuration(duration));
        } catch (error) {
          console.error(
            `Error fetching duration for track ${track.title}:`,
            error
          );
          durations.push("--:--");
        }
      }
      onTotalDurationChange?.(totalDuration);
      setTrackDurations(durations);
    };

    fetchDurations();
  }, [tracks, onTotalDurationChange]);

  function handleClickPlay(track: ReleaseTrack) {
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
    <ul className={combineClassNames(styles.list, className)} {...props}>
      {tracks.map((track, index) => (
        <li key={track.slug} className={styles.item}>
          <div className={styles.flex}>
            <span className={styles.number}>{index + 1}</span>
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
            <div className={styles.info}>
              <h3 className={styles.title}>{track.title}</h3>
              <ArtistsLinks artists={track.artists} />
            </div>
          </div>
          <div className={styles["tag-container"]}>
            {track.tags.map((tag) => (
              <div key={tag.slug} className={styles.tag}>
                {tag.name}
              </div>
            ))}
          </div>
          <span className={styles.duration}>{trackDurations[index]}</span>
        </li>
      ))}
    </ul>
  );
};

export default TrackList;
