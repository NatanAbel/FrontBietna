// import { useState } from "react";

// function Search({  search = null, setSearch = null, searchFilter = null,handleSubmit,searchHouses,setSearchHouses, searchFilterHouse}) {
  
  
//   console.log("filteredHouse...5", );
//   return (
//     <form onSubmit={handleSubmit} className="form-wrapper">
//       <div className="input-wrapper">
//         <div className="dropDown">
//           <ul className="dropDown-search">
//             <input
//               value={search ? search:searchHouses}
//               type="search"
//               placeholder="Seacrch-houses"
//               onChange={ setSearch ?(e) => setSearch(e.target.value):(e) => setSearchHouses(e.target.value)}
//             />
//             <button type="submit">search</button>
//             {searchFilter? searchFilter.map((house) => {
//               return (
//                 <div key={house._id}>
//                   <li className="dropDown-search" key={house._id}>
//                     {house.address}
//                   </li>
//                 </div>
//               );
//             }):searchFilterHouse.map((house) => {
//               return (
//                 <div key={house._id}>
//                   <li className="dropDown-search" key={house._id}>
//                     {house.address}
//                   </li>
//                 </div >
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//     </form>
//   );
// }

// export default Search;
