import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Film adı, yönetmen veya tür ara...' }) => {
  return (
    <div className="input-group shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <span 
        className="input-group-text border-0 ps-3 pe-2" 
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          color: 'var(--secondary-color)',
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px'
        }}
      >
        <i className="bi bi-search fs-5"></i>
      </span>
      <input
        type="text"
        className="form-control border-0 py-3 text-white"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px',
          outline: 'none',
          boxShadow: 'none'
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
