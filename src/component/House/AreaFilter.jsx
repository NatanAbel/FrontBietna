import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selecthouses } from '../../store/houses/selectors';
import { fetchedHouses } from '../../store/houses/thunks';

function AreaFilter({ area, filterArea, forRent,forSale}) {
  const dispatch = useDispatch()
  const house = useSelector(selecthouses)
  const [isLoading, setIsLoading] = useState(true);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([])

  const {houses} = house 

  // filtering house areas based on availability for dropdown
  // const statusAreaFilter = ()=>{
  //   // Sets are JavaScript data structures that store unique values, meaning each value can only occur once within the set.
  //   const selectedArea = new Set()  //initializes a new Set object named selectedArea.
  //   const filterdAreas = houses.filter(house =>{
  //     // Check if houses are available for rent or sale in this area
  //       // console.log("forRent...........",forRent)
  //       if((forRent && house.availability.forRent) || (forSale && house.availability.forSale) ){
  //         return selectedArea.add(house.address)
  //       }
  //     })
  //     // set is converted back to an array using the spread operator [...selectedArea]
  //     setAvailableAreas([...selectedArea]);
  //     // console.log("filterArea....ee",forRent)
  //   }

    const toggleAreaDropdown = (e) => {
      e.preventDefault();
      // console.log("forRent...........1",forRent)
      setShowAreaDropdown(!showAreaDropdown);
    };

  const handleAreaSelection = (selectedArea) => {
    filterArea(selectedArea);
    setShowAreaDropdown(false);
  };

  useEffect(() => {
    dispatch(fetchedHouses)
    // statusAreaFilter()
    setIsLoading(false)
  }, [dispatch]);

  useEffect(() => {
    //Compute available areas whenever houses, forRent, or forSale changes
    const selectedArea = new Set();
    houses.forEach((house) => {
      if ((forRent && house.availability.forRent) || (forSale && house.availability.forSale)) {
        selectedArea.add(house.address);
      }
    });
    //Converting object selectedArea to an array
    setAvailableAreas(Array.from(selectedArea));
  }, [houses, forRent, forSale]);
    

  return (
    <div className="filter-area-container">
      <div className='filter-area'>
        <p className='title-filter-area'>{area ==="" ? <span>Area</span> : area}</p>
        <button className="filter-area-btn" onClick={toggleAreaDropdown}>
          {showAreaDropdown ? <p>🔼</p>:<p>🔽</p> }
        </button>
        <ul className="filter-area-dropdown-display">
          {showAreaDropdown &&  
            availableAreas.map((homeArea) => {
              return (
                <li key={homeArea}>
                  <p
                    onClick={() => handleAreaSelection(homeArea)}
                    className="dropdown-item"
                    value={homeArea}
                  >
                    {homeArea}
                  </p>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default AreaFilter;
