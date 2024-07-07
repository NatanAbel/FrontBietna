import axios from "axios";
import { housesFetched, startLoading } from "./slice";
import { current } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5005";

export const fetchedHouses = (page, limit) => async (dispatch, getState) => {
  try {
    dispatch(startLoading());
    const response = await axios.get(
      `${API_URL}/houses?page=${page}&limit=${limit}`
    );
    dispatch(housesFetched(response.data));
  } catch (e) {
    console.log(e.message);
  }
};
export const searchFiltersFetched =
  (
    page,
    limit,
    search = "",
    forRent,
    forSale,
    minPrice,
    maxPrice,
    beds,
    bath,
    area,
    city,
    houseType,
    features,
    squareAreaMin,
    squareAreaMax
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch(startLoading());
      const response = await axios.get(`${API_URL}/houses/search/result`, {
        params: {
          page,
          limit,
          search,
          forRent,
          forSale,
          minPrice,
          maxPrice,
          beds,
          bath,
          area,
          city,
          houseType,
          features,
          squareAreaMin,
          squareAreaMax,
        },
      });
      // console.log("response...", response.data);
      dispatch(housesFetched(response.data));
    } catch (e) {
      console.log(e.message);
    }
  };
