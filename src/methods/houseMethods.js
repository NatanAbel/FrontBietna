// import { searchFiltersFetched, fetchedHouses } from "../store/houses/thunks";

// export const fetchData = async (
//   state,
//   setIsLoading,
//   setSearch,
//   setCountry,
//   setSearchResult,
//   dispatch,
//   navigate,
//   pathname,
//   fetchHouses,
//   resetToFirstPage
// ) => {
//   setIsLoading(true);
//   try {
//     // Handle navigation state
//     if (state?.search && state.results) {
//       setSearch(state.search);
//       setSearchResult(state.results);

//       // Use searchFiltersFetched directly with search params
//       await dispatch(
//         searchFiltersFetched(
//           1, // Reset to first page
//           9,
//           state.search
//         )
//       );

//       // Clear the state after using it - IMPORTANT to prevent infinite loops
//       navigate(pathname, { replace: true, state: null });
//     } else if (state?.country) {
//       setCountry(state.country);

//       // Use searchFiltersFetched directly with country param
//       await dispatch(
//         searchFiltersFetched(
//           1, // Reset to first page
//           9,
//           "", // No search term
//           state.country
//         )
//       );

//       // Clear the state after using it - IMPORTANT to prevent infinite loops
//       navigate(pathname, { replace: true, state: null });
//     } else {
//       // No special state, just fetch houses normally
//       window.scrollTo(0, 0);
//       resetToFirstPage();
//       await dispatch(fetchedHouses(1, 9)); // Direct dispatch instead of calling fetchHouses
//     }
//   } catch (error) {
//     console.error("Error fetching house data:", error);
//   } finally {
//     setIsLoading(false);
//   }
// };
