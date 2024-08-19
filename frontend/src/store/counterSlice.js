import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  step: 1,
  energy: 100,
  isEnergyEmpty: false,
  telegramId: null,
  totalPoints: 0,
  activePage: "main",
  isDataLoaded: false,
  // isEntered: false,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incrementCount: (state, action) => {
      state.count += action.payload;
      if (state.energy <= 0) {
        state.isEnergyEmpty = true;
      }
    },
    addEnergy: (state, action) => {
      state.energy = Math.min(state.energy + action.payload, 100);
      state.isEnergyEmpty = state.energy === 0;
    },
    spentEnergy: (state, action) => {
      state.energy -= action.payload;
      if (state.energy <= 0) {
        state.isEnergyEmpty = true;
        state.energy = 0;
      }
    },
    setUserData: (state, action) => {
      return { ...state, ...action.payload };
    },
    setEnergy: (state, action) => {
      state.energy = action.payload;
      state.isEnergyEmpty = state.energy === 0;
    },
    setTotalPoints: (state, action) => {
      state.totalPoints = action.payload;
    },
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },

    setIsEntered:(state, action) => {
      state.isEntered = action.payload;
    },

    setisDataLoaded: (state, action) => {
      state.isDataLoaded = action.payload
    }
  },
});

export const {
  incrementCount,
  addEnergy,
  spentEnergy,
  setUserData,
  setEnergy,
  setTotalPoints,
  setActivePage,
  isEntered,
  setIsEntered,
  setisDataLoaded
} = counterSlice.actions;

export default counterSlice.reducer;
