import { TrackList } from "@components/lists/track-list";

/**
 * Page for testing components in isolation.
 */
const SandboxPage = () => {
  function createArray<T>(object: T, length: number) {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push({ ...object });
    }

    return arr;
  }
  const tracks = createArray(
    {
      id: "1",
      coverUrl:
        "https://images.genius.com/1af98c5aa0b4b58669d987be6aec97a8.1000x1000x1.png",
      slug: "track-1",
      title: "Track asdasdsadsadsadsadsdsadsdads1",
      audioUrl:
        "https://storage.googleapis.com/musdis-6b5bf.appspot.com/audio/Alex%20G%20-%20Race.mp3",
      artists: [
        {
          id: "1",
          slug: "artist-1",
          name: "Artist 1",
          coverUrl: "",
          type: {
            id: "1",
            name: "Artist",
            slug: "artist",
          },
          creatorId: "1",
          users: [],
        },
        {
          id: "2",
          slug: "artist-221",
          name: "Artist 12",
          coverUrl: "",
          type: {
            id: "1",
            name: "Artist",
            slug: "artist",
          },
          creatorId: "1",
          users: [],
        },
      ],
    },
    20
  );
  return (
    <>
      <TrackList tracks={tracks} />
    </>
  );
};

export default SandboxPage;
