import React from 'react';
import './Pagination.css'; 

const Pagination = ({ page, setPage, totalPages }) => {
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageChange = (event) => {
    setPage(Number(event.target.value)); 
  };

  return (
    <div className="pagination-container">
      <button onClick={handlePrev} disabled={page === 1}>Back</button>
      <span>{page} / {totalPages}</span>
      <select 
        value={page} 
        onChange={handlePageChange} 
        className="select-width"
      >
        {[...Array(totalPages)].map((_, index) => (
          <option key={index} value={index + 1}>
            {index + 1}
          </option>
        ))}
      </select>
      <button onClick={handleNext} disabled={page === totalPages}>Next</button>
    </div>
  );
};

export default Pagination;

