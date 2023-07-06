import React, { useState, useCallback } from 'react';
import { Menu, MenuItem, Select } from '@mui/material';
import { SearchSharp } from '@mui/icons-material';
import './SearchBar.css';

interface Props {
  placeholder: string;
}

const SearchBar: React.FC<Props> = ({ placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<number[]>([0, 4]);
  const [distanceFilter, setDistanceFilter] = useState<number>(10);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false); // Add state variable for showing/hiding filters

  const handleSearchSubmit = useCallback((event: any) => {
    event.preventDefault();
    // TODO Call API to get matching restaurants based on the search query and filters
  }, []);

  const handleFilterSubmit = useCallback((event: any) => {
    event.preventDefault();
    // TODO Call API to get matching restaurants based on the search query and filters
    toggleFilters();
  }, []);

  const handlePriceFilterChange = (event: any) => {
    setPriceFilter(event.target.value);
  };

  const handleDistanceFilterChange = (event: any) => {
    setDistanceFilter(event.target.value as number);
  };

  const handleRatingFilterChange = (event: any) => {
    setRatingFilter(event.target.value as number);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters); // Toggle the state of showFilters
  };

  return (
    <div>
      <form
        onSubmit={handleSearchSubmit}
        className="search-form">
        <div
          className='search-bar'
        >
          <SearchSharp
            className="search-icon"
          />
          <input
            type='text'
            placeholder={placeholder}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label='Enter search term'
          />
          <button
            type='submit'
            onClick={toggleFilters}
          >
            ☰
          </button>
          {showFilters && (
            <div
              className='filters'
            >
              <Select
                value={priceFilter}
                onChange={handlePriceFilterChange}
                style={{ marginBottom: '0.5rem', width: '10rem' }}>
                <MenuItem value='0'>Any Price</MenuItem>
                <MenuItem value='1'>$$</MenuItem>
                <MenuItem value='2'>$$$</MenuItem>
                <MenuItem value='3'>$$$$</MenuItem>
                <MenuItem value='4'>$$$$$</MenuItem>
              </Select>
              <Select
                value={distanceFilter}
                onChange={handleDistanceFilterChange}
                style={{ marginBottom: '0.5rem', width: '10rem' }}>
                <MenuItem value='10'>Any Distance</MenuItem>
                <MenuItem value='0.5'>0.5 Km</MenuItem>
                <MenuItem value='1'>1 Km</MenuItem>
                <MenuItem value='2'>2 Km</MenuItem>
                <MenuItem value='5'>5 Km</MenuItem>
                <MenuItem value='10'>10 Km</MenuItem>
              </Select>
              <Select
                value={ratingFilter}
                onChange={handleRatingFilterChange}
                style={{ marginBottom: '0.5rem', width: '10rem' }}
              >
                <MenuItem value='0'>Any Rating</MenuItem>
                <MenuItem value='1'>1 star</MenuItem>
                <MenuItem value='2'>2 stars</MenuItem>
                <MenuItem value='3'>3 stars</MenuItem>
                <MenuItem value='4'>4 stars</MenuItem>
                <MenuItem value='5'>5 stars</MenuItem>
              </Select>
              <button
                type='submit'
                onClick={handleFilterSubmit}>
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default React.memo(SearchBar);
