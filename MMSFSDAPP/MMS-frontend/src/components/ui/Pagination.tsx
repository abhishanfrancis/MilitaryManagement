import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxPagesToShow + 2);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-xl transition-all duration-200 ${
            currentPage === 1
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-xl transition-all duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{totalItems > 0 ? startItem : 0}</span> to{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">{endItem}</span> of{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">{totalItems}</span> results
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onLimitChange && (
            <div>
              <label htmlFor="limit" className="sr-only">
                Items per page
              </label>
              <select
                id="limit"
                name="limit"
                className="form-select text-xs rounded-xl border-gray-200 py-2"
                value={itemsPerPage}
                onChange={(e) => onLimitChange(Number(e.target.value))}
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          )}
          <nav className="inline-flex items-center gap-1" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span
                  key={index}
                  className="inline-flex items-center justify-center w-9 h-9 text-sm text-gray-400 dark:text-gray-600"
                >
                  ...
                </span>
              )
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === totalPages || totalPages === 0
                  ? 'text-gray-300 cursor-not-allowed dark:text-gray-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;