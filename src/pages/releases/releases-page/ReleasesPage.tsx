import styles from "./ReleasesPage.module.css";

import { MosaicReleaseList } from "@components/lists/mosaic-release-list";
import { PageLoader } from "@components/loaders/page-loader";
import { Button } from "@components/ui/button";
import Separator from "@components/ui/separator";
import { usePagedFetch } from "@hooks/use-paged-fetch";
import { getLatestReleases } from "@services/releases";
import { isCancelledError } from "@utils/assertions";
import { useState } from "react";

const LIMIT = 20;
const ReleasesPage = () => {
  const [page, setPage] = useState(1);
  const {
    data: releases,
    hasMore,
    isLoading,
    error,
  } = usePagedFetch(
    async (page, pageSize, signal) => {
      return await getLatestReleases(page, pageSize, signal);
    },
    page,
    LIMIT,
    true
  );

  if ((isCancelledError(error) && !releases) || (!releases && isLoading)) {
    return <PageLoader />;
  }

  if (!releases) {
    return <></>;
  }

  return (
    <>
      <div>
        <div className={styles["title-container"]}>
          <h1 className={styles.title}>New releases</h1>
        </div>
        <div>
          <MosaicReleaseList releases={releases} />
        </div>
        <Separator />
        <div className={styles.footer}>
          {hasMore && (
            <Button
              className={styles["load-button"]}
              disabled={isLoading}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {isLoading ? "Loading..." : "Load more"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ReleasesPage;
