import React, { useState, useCallback } from 'react';
import { MenuItem, Select } from '@mui/material';
import { SearchSharp } from '@mui/icons-material';
import './SearchBar.css';

import {  setDistanceFilter} from '../../Redux/slices/restaurantSlice';
import { useDispatch } from 'react-redux';


interface Props {
  placeholder: string;
}

const SearchBar: React.FC<Props> = ({ placeholder }) => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [dfaultDistanceFilter, setDefaultDistanceFilter] = useState<number>(10);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false); // Add state variable for showing/hiding filters

  const toggleFilters = () => {
    setShowFilters(!showFilters); // Toggle the state of showFilters
  };

  const handleSearchSubmit = useCallback((event: any) => {
    event.preventDefault();
    // TODO Call API to get matching restaurants based on the search query and filters
  }, []);

  const handleFilterSubmit = useCallback((event: any) => {
    event.preventDefault();
    // TODO Call API to get matching restaurants based on the search query and filters
    toggleFilters();
  }, []);
  
  const handleRatingFilterChange = (event: any) => {
    setRatingFilter(event.target.value as number);
  };

  const handleDistanceFilterChange = (event: any) => {
    setDefaultDistanceFilter(event.target.value as number);
    dispatch(setDistanceFilter(event.target.value as number))
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
                value={dfaultDistanceFilter}
                onChange={handleDistanceFilterChange}
                style={{ marginBottom: '0.5rem', width: '10rem' }}>
                <MenuItem value='10000'>Any Distance</MenuItem>
                <MenuItem value='0.1'>0.1 Km</MenuItem>
                <MenuItem value='0.2'>0.2 Km</MenuItem>
                <MenuItem value='0.3'>0.3 Km</MenuItem>
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
