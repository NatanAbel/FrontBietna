import axios from "axios";
import { housesFetched, startLoading } from "./slice";
import { current } from "@reduxjs/toolkit";
import { toggleFavorites } from "../auth/slice";
import { bootstrapThunkLogin, fetchLogOut } from "../auth/thunks";
import { loginAxios } from "../../utils/interceptorApi";

const API_URL = import.meta.env.VITE_BACK_URL;

// Delay function for retry logic
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchedHouses =
  (page, limit, options = {}) =>
  async (dispatch, getState) => {
    // Maximum number of retry attempts
    const maxRetries = 2;
    let retryCount = 0;

    const executeRequest = async () => {
      const startTime = performance.now();
      try {
        dispatch(startLoading());
        const response = await axios.get(
          `${API_URL}/houses?page=${page}&limit=${limit}`,
          {
            signal: options.signal,
            headers: {
              "Cache-Control": "public, max-age=300",
            },
            withCredentials: true,
            timeout: options.longTimeout && process.env.NODE_ENV === "production"
              ? 15000
              : 10000,
          }
        );

        // Only process response if request wasn't cancelled
        if (options.signal && options.signal.aborted) {
          return null;
        }

        if (response.data.message) {
          dispatch(
            housesFetched({ message: response.data.message, allHouses: [] })
          ); // Dispatch with no results message
        } else {
          dispatch(housesFetched(response.data)); // Dispatch actual houses data
        }
        // Return the data for caching in components
        return response.data;
      } catch (e) {
        // Properly handle cancellation errors
        if (
          axios.isCancel(e) ||
          e.name === "CanceledError" ||
          e.name === "AbortError"
        ) {
          console.log("Request was canceled");
          // Don't dispatch any action for canceled requests
          return null; // Return null instead of throwing
        }

        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching houses:", {
            message: e.message,
            code: e.code,
            status: e.response?.status,
            data: e.response?.data,
          });
        }

        // Handle timeout errors with retry logic
        if (e.code === "ECONNABORTED" && retryCount < maxRetries) {
          retryCount++;

          // Calculate exponential backoff delay: 2^retry * 1000ms
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 8000);

          // Dispatch a message to inform user of retry
          dispatch(
            housesFetched({
              message: `Request timed out. Retrying in ${
                backoffDelay / 1000
              } seconds... (Attempt ${retryCount} of ${maxRetries})`,
              allHouses: [],
              pageCount: 0,
              totalHouses: 0,
            })
          );

          // Wait for backoff period
          await delay(backoffDelay);

          // Retry the request
          return executeRequest();
        }

        // Add specific handling for timeout errors
        if (e.code === "ECONNABORTED") {
          dispatch(
            housesFetched({
              message:
                "The server is taking longer than usual to respond. Please try again.",
              allHouses: [],
              pageCount: 0, // Provide default values to prevent UI errors
              totalHouses: 0,
            })
          );
          return null;
        }

        throw e; // Re-throw to allow error handling in components
      }
    };
    return executeRequest();
  };

export const searchFiltersFetched =
  (
    page,
    limit,
    searchInput,
    country,
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
    const maxRetries = 2; // Maximum number of retry attempts
    let retryCount = 0;

    const executeSearchRequest = async () => {
      try {
        dispatch(startLoading());
        const response = await axios.get(`${API_URL}/houses/search/result`, {
          params: {
            page:page,
            limit:limit,
            search:searchInput,
            country:country,
            forRent:forRent,
            forSale:forSale,
            minPrice:minPrice,
            maxPrice:maxPrice,
            beds:beds,
            bath:bath,
            area:area,
            city:city,
            houseType:houseType,
            features:features,
            squareAreaMin:squareAreaMin,
            squareAreaMax:squareAreaMax,
          },
          timeout:  process.env.NODE_ENV === "production"
          ? 15000
        : 10000,
        });

        // Check if message is included in the response (no results case)
        if (response.data.message) {
          dispatch(
            housesFetched({
              message: response.data.message,
              allHouses: [],
              uniqueAreas: [],
              uniqueCities: [],
              totalHouses: 0,
              pageCount: 1,
            })
          );
        } else {
          dispatch(housesFetched(response.data)); // Dispatch actual houses data
        }
      } catch (e) {
        if (e.code === "ECONNABORTED" && retryCount < maxRetries) {
          retryCount++;
          const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 8000);

          dispatch(
            housesFetched({
              message: `Search request timed out. Retrying in ${
                backoffDelay / 1000
              } seconds... (Attempt ${retryCount} of ${maxRetries})`,
              allHouses: [],
              pageCount: 0,
              totalHouses: 0,
            })
          );

          await delay(backoffDelay);
          return executeSearchRequest();
        }

        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching houses:", {
            message: e.message,
            code: e.code,
            status: e.response?.status,
            data: e.response?.data,
          });
        }
      } 
    };
    return executeSearchRequest();
  };

export const handleFavourites = (houseId) => async (dispatch, getState) => {
  const body = { favorites: houseId };
  const maxRetries = 2; // Maximum number of retry attempts

  const executeFavoriteRequest = async (retryCount = 0) => {
    try {
      // Get current token
      const token = getState().auth.token;

      // Use loginAxios instance which handles credentials
      const res = await loginAxios.put(`/auth/update/profile`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Important for refresh token
        timeout: process.env.NODE_ENV === "production"
        ? 15000
        : 10000,
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
            throw new Error("Token refresh failed");
          }

          // Get new token after successful refresh
          const newToken = getState().auth.token;
          if (!newToken) {
            throw new Error("No new token received");
          }

          // Retry the request with new token
          return await executeFavoriteRequest(retryCount + 1);
        } catch (refreshError) {
          // If refresh token is expired or refresh fails
          console.error("Token refresh failed:", refreshError);
          await dispatch(fetchLogOut());
          throw new Error("Authentication expired. Please login again.");
        }
      }

      // If we've exceeded retries or got a different error
      if (retryCount >= maxRetries) {
        throw new Error("Maximum retry attempts reached");
      }

      // Handle other errors
      throw error;
    }
  };

  try {
    return await executeFavoriteRequest();
  } catch (error) {
    console.error("Failed to update favorites:", error);
    throw error; // Propagate error to component
  }
};
