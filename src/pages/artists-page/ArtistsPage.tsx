import styles from "./ArtistsPage.module.css";

import { ArtistList } from "@components/lists/artist-list";
import { PageLoader } from "@components/page-loader";
import { usePagedFetch } from "@hooks/use-paged-fetch";
import { Separator } from "@components/ui/separator";
import { getArtists } from "@services/artists";
import { isCancelledError } from "@utils/assertions";
import { useState } from "react";
import { Button } from "@components/ui/button";

const LIMIT = 20;
const ArtistsPage = () => {
  const [page, setPage] = useState(1);

  const {
    data: artists,
    isLoading: isArtistsLoading,
    error: artistsError,
    hasMore,
  } = usePagedFetch(
    async (page, limit, signal) => {
      return await getArtists(page, limit, signal);
    },
    page,
    LIMIT,
    true
  );

  if (
    (!artists && isArtistsLoading) ||
    (!artists && isCancelledError(artistsError))
  ) {
    return <PageLoader />;
  }

  if (!artists) {
    return;
  }

  return (
    <div>
      <h1 className={styles.title}>Artists</h1>
      <ArtistList artists={artists} />
      <Separator />
      <div className={styles.footer}>
        {hasMore && (
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMore}
          >
            Load more
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArtistsPage;
