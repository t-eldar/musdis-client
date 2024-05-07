import ArtistList from "@components/lists/artist-list";
import MosaicReleaseList from "@components/lists/mosaic-release-list";

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
  const artists = createArray(
    {
      id: "string",
      slug: "string",
      name: "string",
      type: {
        name: "Musician",
        slug: "musician"
      },
      coverUrl:
        "https://storage.googleapis.com/musdis-6b5bf.appspot.com/image/e761cb91-925f-410e-b5a0-8efedf61e6a8.jpg",
    },
    20
  );
  return (
    <>
      <ArtistList artists={artists} />
    </>
  );
};

export default SandboxPage;
