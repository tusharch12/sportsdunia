// src/components/TableComponent.js
import React, { useState, useEffect } from 'react';
import collegeData from '../collegeData'; // Import the data from collegeData.js

const TableComponent = () => {
  const [data, setData] = useState([]); // State to hold the displayed data
  const [visibleCount, setVisibleCount] = useState(10); // Number of visible rows at the start
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator
  const [searchTerm, setSearchTerm] = useState(''); // State to manage search input
  const [filteredData, setFilteredData] = useState([]); // State for filtered data based on search
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' }); // State to manage sorting

  useEffect(() => {
    // Filter the data based on the search term
    const filtered = collegeData.filter((college) =>
      college.college.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort the filtered data
    const sortedData = sortData(filtered, sortConfig.key, sortConfig.direction);

    // Load the initial sorted data (first 10 rows)
    setFilteredData(sortedData);
    setData(sortedData.slice(0, visibleCount));
  }, [searchTerm, visibleCount, sortConfig]);

  useEffect(() => {
    // Add scroll event listener
    const handleScroll = () => {
      // Check if the user has scrolled near the bottom of the page
      if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.offsetHeight) {
        loadMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, searchTerm]); // Add dependencies

  // Function to load more data with a delay
  const loadMoreData = () => {
    if (isLoading) return; // Prevent multiple triggers

    setIsLoading(true); // Show loading indicator

    // Simulate a delay of 1 second before loading more data
    setTimeout(() => {
      setVisibleCount((prevCount) => prevCount + 10); // Increase visible count by 10
      setIsLoading(false); // Hide loading indicator after loading
    }, 1000);
  };

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setVisibleCount(10); // Reset visible count on sorting
  };

  // Function to sort data with error handling
  const sortData = (data, key, direction) => {
    if (!key) return data;

    return [...data].sort((a, b) => {
      let valueA, valueB;

      if (key === 'fees' || key === 'rating' || key === 'reviewsScore') {
        valueA = key === 'reviewsScore' ? parseFloat(a[key]) : parseInt((a[key] || '0').replace(/,/g, ''), 10);
        valueB = key === 'reviewsScore' ? parseFloat(b[key]) : parseInt((b[key] || '0').replace(/,/g, ''), 10);
      } else {
        return 0;
      }

      if (isNaN(valueA)) valueA = 0; // Handle NaN values
      if (isNaN(valueB)) valueB = 0; // Handle NaN values

      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
  };

  return (
    <div>
      <h2>College Information Table</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by College Name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setVisibleCount(10); // Reset visible count on new search
        }}
        style={{ padding: '10px', marginBottom: '20px', width: '100%', boxSizing: 'border-box' }}
      />

      {/* Sorting Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => handleSort('fees')}>Sort by Fees ({sortConfig.key === 'fees' ? sortConfig.direction : 'asc'})</button>
        <button onClick={() => handleSort('rating')}>Sort by Rating ({sortConfig.key === 'rating' ? sortConfig.direction : 'asc'})</button>
        <button onClick={() => handleSort('reviewsScore')}>Sort by User Review Rating ({sortConfig.key === 'reviewsScore' ? sortConfig.direction : 'asc'})</button>
      </div>

      <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: 'lightgreen', color: 'white' }}>
            <th>CD Rank</th>
            <th>Colleges</th>
            <th>Course Fees</th>
            <th>Placement</th>
            <th>User Reviews</th>
            <th>Ranking</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.id}</td>
              {/* College Details */}
              <td style={{ padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img
                    src={row.college.logo}
                    alt={row.college.name}
                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                  />
                  <div>
                    <strong>{row.college.name}</strong>
                    <br />
                    <span>{row.college.address}</span>
                  </div>
                </div>
                {/* Course Name with Cut-off */}
                <div style={{ width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '10px' }}>
                  {row.college.course}
                </div>
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <button style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: 'lightcoral', cursor: 'pointer' }}>
                    Apply Now <span style={{ marginLeft: '5px' }}>➡️</span>
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: 'green', cursor: 'pointer' }}>
                    📥 <span style={{ marginLeft: '5px' }}>Download Brochure</span>
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: 'black', cursor: 'pointer' }}>
                    📦 <span style={{ marginLeft: '5px' }}>Add to Compare</span>
                  </button>
                </div>
              </td>
              {/* Course Fees Details */}
              <td style={{ padding: '10px' }}>
                <div style={{ color: 'green', marginBottom: '5px' }}>₹ {row.fees}</div>
                <div style={{ marginBottom: '5px' }}>{row.courseType}</div>
                <div style={{ marginBottom: '5px' }}>- {row.feesDescription}</div>
                <div style={{ color: 'orange', cursor: 'pointer' }}>Compare Fees</div>
              </td>
              {/* Placement Details */}
              <td style={{ padding: '10px' }}>
                <div style={{ color: 'green', marginBottom: '5px' }}>₹ {row.placement}</div>
                <div style={{ marginBottom: '5px' }}>Average Package</div>
                <div style={{ color: 'green', fontSize: '1.2em', marginBottom: '5px' }}>₹ {row.highestPackage}</div>
                <div style={{ marginBottom: '5px' }}>Highest Package</div>
                <div style={{ color: 'orange', cursor: 'pointer' }}>Compare Placement</div>
              </td>
              {/* User Reviews Details */}
              <td style={{ padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ color: 'yellow', fontSize: '1.2em', marginRight: '5px' }}>●</span> {row.reviewsScore}
                </div>
                <div style={{ marginBottom: '5px' }}>Based on {row.reviewsCount} User</div>
                <div style={{ marginBottom: '5px' }}>Reviews</div>
                <div style={{ backgroundColor: 'yellow', display: 'inline-flex', alignItems: 'center', padding: '2px 5px', borderRadius: '5px' }}>
                  ✔️ <span style={{ marginLeft: '5px' }}>Best in Social Life</span>
                </div>
              </td>
              {/* Ranking Details */}
              <td style={{ padding: '10px' }}>
                <div style={{ marginBottom: '5px' }}>
                  {row.rankingPosition}
                  <span style={{ color: 'orange' }}>{row.rankingHighlight}</span> in India
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={row.rankingLogo}
                    alt="Ranking Logo"
                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                  />
                  <span>{row.rankingYear}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Loading Indicator */}
      {isLoading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>}
    </div>
  );
};

export default TableComponent;
