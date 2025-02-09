/* eslint-disable react/prop-types */
function Pagination({ pageInfo, handlePageChange }) {
  return (
    <div className="d-flex justify-content-center">
      <nav aria-label="Page navigation">
        <ul className="pagination">
          {/* 上一頁 */}
          <li className={`page-item ${!pageInfo.has_pre ? "disabled" : ""}`}>
            <button
              onClick={() =>
                pageInfo.has_pre && handlePageChange(pageInfo.current_page - 1)
              }
              className="page-link"
              aria-label="Previous Page"
              disabled={!pageInfo.has_pre}
            >
              上一頁
            </button>
          </li>

          {/* 頁碼 */}
          {Array.from({ length: pageInfo.total_pages }, (_, index) => (
            <li
              key={`page-${index + 1}`}
              className={`page-item ${
                pageInfo.current_page === index + 1 ? "active" : ""
              }`}
            >
              <button
                onClick={() => handlePageChange(index + 1)}
                className="page-link"
                aria-label={`Page ${index + 1}`}
              >
                {index + 1}
              </button>
            </li>
          ))}

          {/* 下一頁 */}
          <li className={`page-item ${!pageInfo.has_next ? "disabled" : ""}`}>
            <button
              onClick={() =>
                pageInfo.has_next && handlePageChange(pageInfo.current_page + 1)
              }
              className="page-link"
              aria-label="Next Page"
              disabled={!pageInfo.has_next}
            >
              下一頁
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
