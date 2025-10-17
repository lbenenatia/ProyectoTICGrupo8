import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const SearchBar = ({ searchQuery, onSearchChange, onSortChange, sortBy, totalResults }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  const searchSuggestions = [
    { type: 'ingredient', text: 'Pepperoni', icon: 'Circle' },
    { type: 'dietary', text: 'Gluten-Free', icon: 'Leaf' },
    { type: 'pizza', text: 'Margherita', icon: 'Pizza' },
    { type: 'ingredient', text: 'Mushrooms', icon: 'Circle' },
    { type: 'dietary', text: 'Vegan', icon: 'Leaf' },
    { type: 'pizza', text: 'BBQ Chicken', icon: 'Pizza' },
    { type: 'ingredient', text: 'Extra Cheese', icon: 'Circle' },
    { type: 'dietary', text: 'Keto-Friendly', icon: 'Leaf' }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' },
    { value: 'name', label: 'Alphabetical', icon: 'AlphabeticalOrder' }
  ];

  const filteredSuggestions = searchSuggestions?.filter(suggestion =>
    suggestion?.text?.toLowerCase()?.includes(searchQuery?.toLowerCase()) && searchQuery?.length > 0
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef?.current && !searchInputRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion?.text);
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  const clearSearch = () => {
    onSearchChange('');
    searchInputRef?.current?.focus();
  };

  const getSortLabel = () => {
    const option = sortOptions?.find(opt => opt?.value === sortBy);
    return option ? option?.label : 'Sort by';
  };

  return (
    <div className="bg-card rounded-lg shadow-warm-sm p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md" ref={searchInputRef}>
          <div className={`relative transition-warm ${isSearchFocused ? 'transform scale-105' : ''}`}>
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <input
              type="text"
              placeholder="Search pizzas, ingredients, dietary options..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              onFocus={handleSearchFocus}
              className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-secondary transition-warm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-warm"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (searchQuery?.length > 0 ? filteredSuggestions?.length > 0 : true) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-warm-lg z-50 max-h-64 overflow-y-auto">
              {searchQuery?.length > 0 ? (
                <>
                  {filteredSuggestions?.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-warm border-b border-border last:border-b-0"
                    >
                      <Icon 
                        name={suggestion?.icon} 
                        size={16} 
                        className={`${
                          suggestion?.type === 'dietary' ? 'text-success' :
                          suggestion?.type === 'ingredient'? 'text-primary' : 'text-accent'
                        }`}
                      />
                      <div>
                        <div className="text-sm font-medium text-text-primary">{suggestion?.text}</div>
                        <div className="text-xs text-text-secondary capitalize">{suggestion?.type}</div>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <div className="px-4 py-2 text-xs font-medium text-text-secondary uppercase tracking-wide border-b border-border">
                    Popular Searches
                  </div>
                  {searchSuggestions?.slice(0, 6)?.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-warm"
                    >
                      <Icon 
                        name={suggestion?.icon} 
                        size={16} 
                        className={`${
                          suggestion?.type === 'dietary' ? 'text-success' :
                          suggestion?.type === 'ingredient'? 'text-primary' : 'text-accent'
                        }`}
                      />
                      <div>
                        <div className="text-sm font-medium text-text-primary">{suggestion?.text}</div>
                        <div className="text-xs text-text-secondary capitalize">{suggestion?.type}</div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Results Count and Sort */}
        <div className="flex items-center justify-between lg:justify-end space-x-4">
          <div className="text-sm text-text-secondary">
            {totalResults} {totalResults === 1 ? 'pizza' : 'pizzas'} found
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e?.target?.value)}
              className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-warm"
            >
              {sortOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
            />
          </div>
        </div>
      </div>
      {/* Quick Filter Tags */}
      {searchQuery && (
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Searching for:</span>
          <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
            <span>"{searchQuery}"</span>
            <button onClick={clearSearch} className="ml-1 hover:bg-primary/20 rounded-full p-0.5">
              <Icon name="X" size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;