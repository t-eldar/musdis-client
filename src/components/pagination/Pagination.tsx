import styles from "./Pagination.module.css";

import {
  TbArrowBadgeLeftFilled,
  TbArrowBadgeRightFilled,
} from "react-icons/tb";
import { DOTS, usePagination } from "@hooks/use-pagination";
import { combineClassNames } from "@utils/style-utils";

type PaginationProps = {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
};

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount,
  currentPage,
  pageSize,
}: PaginationProps) => {
  const paginationRange = usePagination(
    totalCount,
    pageSize,
    currentPage,
    siblingCount
  );

  function onNext() {
    onPageChange(currentPage + 1);
  }
  function onPrevious() {
    onPageChange(currentPage - 1);
  }
  const lastPage = paginationRange[paginationRange.length - 1];

  if (currentPage === 0 || paginationRange.length < 2) {
    console.log(paginationRange);
    
    return null;
  }
  return (
    <ul className={styles.list}>
      <li
        key="previous"
        className={combineClassNames(
          styles.item,
          currentPage === 1 ? styles.disabled : ""
        )}
        onClick={onPrevious}
      >
        <div className={styles.arrow}>
          {" "}
          <TbArrowBadgeLeftFilled />{" "}
        </div>
      </li>
      {paginationRange?.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={`dots_${index}`}
              className={combineClassNames(styles.item, styles.dots)}
            >
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={pageNumber}
            className={combineClassNames(
              styles.item,
              pageNumber === currentPage ? styles.selected : ""
            )}
            onClick={() => onPageChange(Number(pageNumber))}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        key="next"
        className={combineClassNames(
          styles.item,
          currentPage === lastPage ? styles.disabled : ""
        )}
        onClick={onNext}
      >
        <div className={styles.arrow}>
          {" "}
          <TbArrowBadgeRightFilled />{" "}
        </div>
      </li>
    </ul>
  );
};

export default Pagination;
