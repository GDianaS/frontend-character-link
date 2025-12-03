const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("gap");
      if (currentPage > 2) pages.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPages) pages.push(currentPage);
      if (currentPage < totalPages - 1) pages.push(currentPage + 1);
      if (currentPage < totalPages - 2) pages.push("gap");
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = generatePages();

  // Estilos base para os botões para evitar repetição
  const baseBtnStyles = "flex items-center justify-center h-9 min-w-[36px] px-3 rounded-lg text-sm font-medium transition-all duration-200 border";
  
  // Estilo para botões inativos/padrão (usando suas cores primary e bg)
  const defaultStyles = "border-transparent text-myown-primary-600 hover:bg-myown-primary-100 hover:text-myown-primary-800";
  
  // Estilo para o botão ativo (destaque forte)
  const activeStyles = "bg-myown-primary-700 text-myown-bg-50 border-myown-primary-800 shadow-[var(--shadow-box-glass)] transform scale-105";
  
  // Estilo para botões desabilitados
  const disabledStyles = "text-myown-primary-200 cursor-not-allowed hover:bg-transparent";

  return (
    <nav
      aria-label="Page navigation"
      className="flex items-center justify-center mt-10 mb-4"
    >
      <ul className="flex items-center gap-2 p-1 bg-myown-bg-50/50 rounded-xl backdrop-blur-sm">
        {/* Previous */}
        <li>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className={`${baseBtnStyles} ${currentPage === 1 ? disabledStyles : defaultStyles}`}
          >
            <ChevronLeft />
          </button>
        </li>

        {/* Pages */}
        {pages.map((p, i) => (
          <li key={i}>
            {p === "gap" ? (
              <span className="flex items-end justify-center h-9 w-9 pb-2 text-myown-primary-400">
                …
              </span>
            ) : (
              <button
                onClick={() => onPageChange(p)}
                className={`
                  ${baseBtnStyles}
                  ${p === currentPage ? activeStyles : defaultStyles}
                `}
              >
                {p}
              </button>
            )}
          </li>
        ))}

        {/* Next */}
        <li>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className={`${baseBtnStyles} ${currentPage === totalPages ? disabledStyles : defaultStyles}`}
          >
            <ChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
}
