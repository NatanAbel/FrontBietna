import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  allHouses: [],
  uniqueAreas: [],
  uniqueCities: [],
  totalHouses: 0,
  pageCount: 1,
};

export const houseSlice = createSlice({
  name: "house",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    housesFetched: (state, action) => {
      const houseData = action.payload;
      state.allHouses = houseData.result;
      state.uniqueAreas = houseData.uniqueAreas;
      state.uniqueCities = houseData.uniqueCities;
      state.totalHouses = houseData.totalHouses
      state.pageCount = houseData.pageCount;
      state.loading = false;
    },
  },
});

export const { startLoading, housesFetched } = houseSlice.actions;

export default houseSlice.reducer;
