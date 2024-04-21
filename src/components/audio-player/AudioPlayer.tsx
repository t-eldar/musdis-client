import { ProgressBar } from "@components/audio-player/progress-bar";
import { Controls } from "@components/audio-player/controls";
import { Cover } from "@components/audio-player/cover";
import { Root } from "@components/audio-player/root";
import { TimeProgress } from "@components/audio-player/time-progress";

const AudioPlayer = {
  Root: Root,
  Cover: Cover,
  TimeProgress: TimeProgress,
  Controls: Controls,
  ProgressBar: ProgressBar,
};

export default AudioPlayer;

// import * as AspectRatio from "@radix-ui/react-aspect-ratio";

// import styles from "./AudioPlayer.module.css";
// import { AudioControls } from "@components/audio-player/audio-controls";
// import { AudioProgressBar } from "@components/audio-player/audio-progress-bar";
// import { useDidMountEffect } from "@hooks/use-did-mount-effect";
// import { createContext, useRef, useState } from "react";
// import { AudioTimeProgress } from "@components/audio-player/audio-time-progress";

// type AudioPlayerProps = {
//   currentSong?: {
//     title: string;
//     audioUrl: string;
//     author: string;
//     coverUrl: string;
//   };
//   onNext: () => void;
//   onPrevious: () => void;
// };

// const AudioPlayer = ({ currentSong, onNext, onPrevious }: AudioPlayerProps) => {
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   const [isReady, setIsReady] = useState(false);
//   const [volume, setVolume] = useState(0.2);
//   const [isPlaying, setIsPlaying] = useState(false);

//   useDidMountEffect(() => {
//     audioRef.current?.pause();

//     const timeout = setTimeout(() => {
//       audioRef.current?.play();
//     }, 500);

//     return () => {
//       clearTimeout(timeout);
//     };
//   }, [currentSong]);

//   function handleNext() {
//     onNext();
//   }

//   function handlePrevious() {
//     if (audioRef.current && audioRef.current.currentTime > 5) {
//       audioRef.current.currentTime = 0;
//     } else {
//       onPrevious();
//     }
//   }

//   function handleTogglePlayPause() {
//     if (isPlaying) {
//       audioRef.current?.pause();
//       setIsPlaying(false);
//     } else {
//       audioRef.current?.play();
//       setIsPlaying(true);
//     }
//   }
//   return (
//     <div style={{ background: "black" }}>
//       <div className={styles["cover-container"]}>
//         <AspectRatio.Root ratio={1}>
//           <img
//             className={styles.cover}
//             src={currentSong?.coverUrl}
//             alt="Upload preview"
//           />
//         </AspectRatio.Root>
//       </div>
//       {currentSong && (
//         <audio
//           ref={audioRef}
//           preload="metadata"
//           onPlaying={() => setIsPlaying(true)}
//           onPause={() => setIsPlaying(false)}
//           onEnded={handleNext}
//           onCanPlay={(e) => {
//             e.currentTarget.volume = volume;
//             setIsReady(true);
//           }}
//           onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
//           src={currentSong.audioUrl}
//         />
//       )}
//       {isReady && (
//         <>
//           <AudioProgressBar audioElement={audioRef.current!} />
//           <AudioTimeProgress audioElement={audioRef.current!} />
//           <div>
//             <AudioControls
//               isPlaying={isPlaying}
//               onClickNext={handleNext}
//               onClickPrevious={handlePrevious}
//               onClickTogglePlay={handleTogglePlayPause}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
