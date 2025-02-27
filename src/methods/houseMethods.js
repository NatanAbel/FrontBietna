import { searchFiltersFetched } from "../store/houses/thunks";

export const fetchData = async (state, setIsLoading, setSearch,setCountry, setSearchResult, dispatch, navigate, pathname, fetchHouses, resetToFirstPage) => {
setIsLoading(true);
    try {
      // Handle navigation state
      if (state?.search && state.results) {
        setSearch(state.search);
        setSearchResult(state.results);
        // Use searchFiltersFetched immediately with search params
        dispatch(
          searchFiltersFetched(
            1, // Reset to first page
            9,
            state.search,
          )
        );
        // Clear the state after using it
        navigate(pathname, { replace: true, state: { search: ""}, results: []  });
        return; // Exit early
      } else if (state?.country) {
        setCountry(state.country);
        // Use searchFiltersFetched immediately with country param
        dispatch(
          searchFiltersFetched(
            1, // Reset to first page
          9,
          "", // No search term
          state.country 
          )
        );
        // Clear the state after using it
        navigate(pathname, { replace: true, state: { country: ""} });
        return; 
      }else{
        // Scroll to the top of the page
        window.scrollTo(0, 0);
        resetToFirstPage();
        fetchHouses();
      }
    } finally {
      setIsLoading(false);
    }
  };
