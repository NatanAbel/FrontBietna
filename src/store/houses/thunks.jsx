import axios from "axios";
import { housesFetched, startLoading } from "./slice";
import { current } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_BACK_URL;

export const fetchedHouses = (page, limit) => async (dispatch, getState) => {
  try {
    dispatch(startLoading());
    const response = await axios.get(
      `${API_URL}/houses?page=${page}&limit=${limit}`
    );
    if (response.data.message) {
      dispatch(housesFetched({ message: response.data.message, allHouses: [] })); // Dispatch with no results message
    } else {
      dispatch(housesFetched(response.data)); // Dispatch actual houses data
    }
  } catch (e) {
    console.log(e);
  }
};

export const searchFiltersFetched =
  (
    page,limit,search,country,forRent,forSale,minPrice,maxPrice,beds,bath,area,city, houseType,features,squareAreaMin,squareAreaMax
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch(startLoading());
      const response = await axios.get(`${API_URL}/houses/search/result`, {
        params: {
          page, limit, search, country, forRent, forSale, minPrice, maxPrice, beds, bath, area, city, houseType, features, squareAreaMin, squareAreaMax,
        },
      });
      
        // Check if message is included in the response (no results case)
        if (response.data.message) {
          dispatch(housesFetched({
            message: response.data.message,
            allHouses: [],
            uniqueAreas: [],
            uniqueCities: [],
            totalHouses: 0,
            pageCount: 1
          }));
        } else {
          dispatch(housesFetched(response.data)); // Dispatch actual houses data
        }
    } catch (e) {
      console.log(e);
    }
  };
