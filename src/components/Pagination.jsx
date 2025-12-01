function Pagination({ currentPage, totalPages, onPageChange }) {
  const generatePages = () => {
    const pages = [];

    if (totalPages <= 6) {
      // poucas páginas -> mostra todas
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // página 1 sempre visível
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      // página anterior
      if (currentPage > 2) pages.push(currentPage - 1);

      // página atual
      if (currentPage !== 1 && currentPage !== totalPages)
        pages.push(currentPage);

      // próxima página
      if (currentPage < totalPages - 1) pages.push(currentPage + 1);

      if (currentPage < totalPages - 2) pages.push("...");

      // última página sempre visível
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-6 select-none">

      {/* ANTERIOR */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={`px-3 py-1 rounded-xl border ${
          currentPage === 1
            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
            : "hover:bg-gray-200"
        }`}
      >
        Anterior
      </button>

      {/* NÚMEROS */}
      {pages.map((page, index) => (
        <button
          key={index}
          disabled={page === "..."}
          onClick={() => page !== "..." && onPageChange(page)}
          className={`
            px-3 py-1 rounded-xl border 
            ${
              page === currentPage
                ? "bg-myown-primary-500 text-white border-myown-primary-600"
                : page === "..."
                ? "cursor-default bg-gray-100 text-gray-600"
                : "hover:bg-gray-200"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* PRÓXIMO */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className={`px-3 py-1 rounded-xl border ${
          currentPage === totalPages
            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
            : "hover:bg-gray-200"
        }`}
      >
        Próximo
      </button>
    </div>
  );
}

export default Pagination;
