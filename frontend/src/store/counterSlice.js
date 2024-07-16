import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 0,
    energy: 100,
    step: 1,
    isEnergyEmpty: false,
    telegramId: null,
  },
  reducers: {
    incrementCount: (state, action) => {
      if (state.energy > 0) {
        state.isEnergyEmpty = false;
        state.count += action.payload;
      }
    },
    spentEnergy: (state, action) => {
      if (state.energy > 0) {
        state.energy -= action.payload;
      }

      if (state.energy <= 0) {
        state.energy = 0;
        state.isEnergyEmpty = true;
      }
    },
    addEnergy: (state, action) => {
      if (state.energy + action.payload > 100) {
        state.energy = 100;
        return;
      }
      state.isEnergyEmpty = false;
      state.energy += action.payload;
    },
    updateStep: (state, action) => {
      state.step = action.payload;
    },
    setUserData: (state, action) => {
      state.count = action.payload.totalPoints ?? state.count;
      state.energy = action.payload.energy ?? state.energy;
      state.step = action.payload.step ?? state.step;
      state.telegramId = action.payload.telegramId ?? state.telegramId;
    },
  },
});

export const { incrementCount, spentEnergy, updateStep, addEnergy, setUserData } =
  counterSlice.actions;

export default counterSlice.reducer;
