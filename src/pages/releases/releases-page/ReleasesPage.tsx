import ReleaseList from "@components/lists/release-list";
import styles from "./ReleasesPage.module.css";

import { Footer } from "@components/footer";
import { PageLoader } from "@components/loaders/page-loader";
import { Pagination } from "@components/pagination";
import { SearchBar } from "@components/search-bar";
import { usePagedFetch } from "@hooks/use-paged-fetch";
import { getLatestReleases } from "@services/releases";
import { isCancelledError } from "@utils/assertions";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Separator from "@components/ui/separator";
import ErrorResponse from "@components/error-response";

const LIMIT = 20;
const ReleasesPage = () => {
  const [params, setParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(params.get("search") || "");

  useEffect(() => {
    setSearchValue(params.get("search") || "");
  }, [params]);

  const [page, setPage] = useState(1);
  const {
    data: releases,
    hasMore,
    isLoading,
    error,
    totalCount,
  } = usePagedFetch(
    async (page, pageSize, signal) => {
      return await getLatestReleases(page, pageSize, searchValue, signal);
    },
    page,
    LIMIT,
    false,
    [params]
  );

  useEffect(() => {
    setPage(1);
  }, [params]);

  if ((isCancelledError(error) && !releases) || (!releases && isLoading)) {
    return <PageLoader />;
  }

  if (error && !isCancelledError(error)) {
    return <ErrorResponse />;
  }

  if (!releases) {
    return <></>;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles["search-container"]}>
          <h1>Releases</h1>
          <SearchBar
            className={styles.search}
            value={searchValue}
            setValue={setSearchValue}
            onSearch={(q) => setParams({ search: q })}
          />
        </div>

        <ReleaseList releases={releases} />
        <div className={styles.footer}>
          <Pagination
            onPageChange={setPage}
            pageSize={LIMIT}
            totalCount={totalCount}
            currentPage={page}
            siblingCount={1}
          />
        </div>
        <Separator />
        <Footer />
      </div>
    </>
  );
};

export default ReleasesPage;
