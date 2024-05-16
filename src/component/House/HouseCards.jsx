// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart } from "@fortawesome/free-regular-svg-icons";
// import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
// import PropTypes from 'prop-types';

// function HouseCards(props) {

//   const { isLike, setIsLike, house, toggle,  isLoading} = props;

//   // avoiding prop missing validation warings
//   HouseCards.propTypes = {
//     isLike: PropTypes.bool.isRequired,
//     setIsLike: PropTypes.func.isRequired,
//     house: PropTypes.shape({
//       availability: PropTypes.shape({
//         forRent: PropTypes.bool.isRequired,
//       }).isRequired,
//       images: PropTypes.arrayOf(PropTypes.string).isRequired,
//       address: PropTypes.string.isRequired,
//       price: PropTypes.number.isRequired,
//       bathrooms: PropTypes.number.isRequired,
//       bedrooms: PropTypes.number.isRequired,
//       sqm: PropTypes.number.isRequired,
//     }),
//     toggle: PropTypes.func.isRequired,
//     isLoading: PropTypes.bool,
//   };

//   console.log("HouseC.....", !!isLoading);
//   return (
//       <div className="container-houses">
//         <div className="house-cards">
//           {isLoading ? (
//             <div className="card-container">
//               <div className="card-img">
//                 <button className="btn-faHeart" onClick={toggle}>
//                   {isLike ? (
//                     <FontAwesomeIcon icon={faHeartbeat} />
//                   ) : (
//                     <FontAwesomeIcon icon={faHeart} />
//                   )}
//                 </button>
//                 <p className="card-img-text">
//                   {house.availability.forRent ? "For rent" : "For Seal"}
//                 </p>
//                 <img src={house.images[0]} alt="House image" />
//               </div>
//               <div className="card-body">
//                 <h1>{house.address}</h1>
//                 <p>
//                   <span>${house.price}</span>
//                 </p>
//                 <div className="card-info">
//                   <p>Bathrooms: {house.bathrooms}</p>
//                   <p>Bedrooms: {house.bedrooms}</p>
//                   <p>sqm: {house.sqm}</p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p>Loading....</p>
//           )}
//         </div>
//       </div>

//   );
// }

// export default HouseCards;
