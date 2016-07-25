var SearchResults = () => (
  <div className="">
    { searchResults.map((searchItem, idx) =>
      <SearchResultItem searchItem={ searchItem } key={ idx } />
    )}
  </div>
);


window.SearchResults = SearchResults;
