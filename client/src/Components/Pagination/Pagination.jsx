import React from 'react'
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          className={`page-button ${page === currentPage ? 'active' : ''}`}
          onClick={() => {
            if(page !== currentPage){
              onPageChange(page);
            }
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination