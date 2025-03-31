import axios from "axios";
import { housesFetched, startLoading } from "./slice";
import { current } from "@reduxjs/toolkit";
import { toggleFavorites } from "../auth/slice";
import { bootstrapThunkLogin, fetchLogOut } from "../auth/thunks";

const API_URL = import.meta.env.VITE_BACK_URL;

export const fetchedHouses = (page, limit, options = {}) => async (dispatch, getState) => {
  try {
    dispatch(startLoading());
    const response = await axios.get(
      `${API_URL}/houses?page=${page}&limit=${limit}`,{signal: options.signal,
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
        timeout: options.longTimeout ? 15000 : 8000,
        withCredentials: true,
      }
    );

    // Only process response if request wasn't cancelled
    if (options.signal && options.signal.aborted) {
      return null;
    }

    if (response.data.message) {
      dispatch(housesFetched({ message: response.data.message, allHouses: [] })); // Dispatch with no results message
    } else {
      dispatch(housesFetched(response.data)); // Dispatch actual houses data
    }
    // Return the data for caching in components
    return response.data;
  } catch (e) {
    // Properly handle cancellation errors
    if (axios.isCancel(e) || e.name === 'CanceledError' || e.name === 'AbortError') {
      console.log('Request was canceled', e.message);
      // Don't dispatch any action for canceled requests
      return null; // Return null instead of throwing
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching houses:", {
        message: e.message,
        code: e.code,
        status: e.response?.status,
        data: e.response?.data
      });
    }
    
    dispatch(housesFetched({ error: e.message, allHouses: [] }));

    throw e;// Re-throw to allow error handling in components
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
  
  export const handleFavourites = (houseId) => async (dispatch, getState) => {
    const body = { favorites: houseId };
    const maxRetries = 2; // Maximum number of retry attempts
  
    const executeFavoriteRequest = async (retryCount = 0) => {
      try {
        // Get current token
        const token = getState().auth.token;
        
        // Use loginAxios instance which handles credentials
        const res = await axios.put(`${API_URL}/auth/update/profile`, body, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true // Important for refresh token
        });
  
        if (res.status === 200) {
          dispatch(toggleFavorites(houseId));
          return true;
        }
      } catch (error) {
        // Handle expired access token (403)
        if (error.response?.status === 403 && retryCount < maxRetries) {
          try {
            // Attempt to refresh token
            const refreshSuccess = await dispatch(bootstrapThunkLogin());
            
            if (!refreshSuccess) {
              throw new Error('Token refresh failed');
            }
  
            // Get new token after successful refresh
            const newToken = getState().auth.token;
            if (!newToken) {
              throw new Error('No new token received');
            }
  
            // Retry the request with new token
            return await executeFavoriteRequest(retryCount + 1);
          } catch (refreshError) {
            // If refresh token is expired or refresh fails
            console.error('Token refresh failed:', refreshError);
            await dispatch(fetchLogOut());
            throw new Error('Authentication expired. Please login again.');
          }
        }
  
        // If we've exceeded retries or got a different error
        if (retryCount >= maxRetries) {
          throw new Error('Maximum retry attempts reached');
        }
  
        // Handle other errors
        throw error;
      }
    };
  
    try {
      return await executeFavoriteRequest();
    } catch (error) {
      console.error('Failed to update favorites:', error);
      throw error; // Propagate error to component
    }
  };