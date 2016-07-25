"use strict";

var SearchResults = function SearchResults() {
  return React.createElement(
    "div",
    { className: "" },
    searchResults.map(function (searchItem, idx) {
      return React.createElement(SearchResultItem, { searchItem: searchItem, key: idx });
    })
  );
};

window.SearchResults = SearchResults;