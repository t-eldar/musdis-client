import Footer from "@components/footer";
import styles from "./ArtistsPage.module.css";

import { ArtistList } from "@components/lists/artist-list";
import { PageLoader } from "@components/loaders/page-loader";
import Pagination from "@components/pagination";
import { SearchBar } from "@components/search-bar";
import { Separator } from "@components/ui/separator";
import { usePagedFetch } from "@hooks/use-paged-fetch";
import { getArtists } from "@services/artists";
import { isCancelledError } from "@utils/assertions";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorResponse from "@components/error-response";

const LIMIT = 20;
const ArtistsPage = () => {
  const [params, setParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(params.get("search") || "");

  useEffect(() => {
    setSearchValue(params.get("search") || "");
  }, [params]);

  const [page, setPage] = useState(1);
  const {
    data: artists,
    isLoading,
    error,
    totalCount,
  } = usePagedFetch(
    async (page, pageSize, signal) => {
      return await getArtists(page, pageSize, searchValue, signal);
    },
    page,
    LIMIT,
    false,
    [params]
  );

  useEffect(() => {
    setPage(1);
  }, [params]);

  if ((isCancelledError(error) && !artists) || (!artists && isLoading)) {
    return <PageLoader />;
  }

  if (error && !isCancelledError(error)) { 
    return <ErrorResponse />;
  }

  if (!artists) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <div className={styles["search-container"]}>
        <h1>Musicians</h1>
        <SearchBar
          className={styles.search}
          value={searchValue}
          setValue={setSearchValue}
          onSearch={(q) => setParams({ search: q })}
        />
      </div>
      <ArtistList artists={artists} />
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
  );
};

export default ArtistsPage;
