import React, { useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

export default function Pagination({ currentPage, totalPages, setPage }) {
  if (!totalPages || totalPages < 2) return null;

  /* ==========================
       AUTO-FIX currentPage
  ========================== */
  useEffect(() => {
    if (currentPage > totalPages) setPage(totalPages);
  }, [totalPages]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setPage(page);

    // smooth scroll but prevent layout thrashing
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const generatePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // simple: 1 2 3 4 5
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    if (currentPage > 2) pages.push(1);
    if (currentPage > 3) pages.push("...");

    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i >= 1 && i <= totalPages) pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");
    if (currentPage < totalPages - 1) pages.push(totalPages);

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex flex-col items-center mt-8 space-y-3">

      {/* STATUS */}
      <p className="text-gray-600 text-sm">
        Page <span className="font-semibold">{currentPage}</span> of {totalPages}
      </p>

      {/* NAV BUTTONS */}
      <div className="flex items-center space-x-2">

        {/* FIRST */}
        <button
          aria-label="First Page"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded border ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <FaAngleDoubleLeft />
        </button>

        {/* PREV */}
        <button
          aria-label="Previous Page"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded border ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <FaChevronLeft />
        </button>

        {/* PAGE NUMBERS */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={idx}
              className="px-3 py-1 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={idx}
              aria-label={`Page ${page}`}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded border ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          aria-label="Next Page"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded border ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <FaChevronRight />
        </button>

        {/* LAST */}
        <button
          aria-label="Last Page"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded border ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
}
