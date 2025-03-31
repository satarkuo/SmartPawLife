import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};
export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    pushMessage(state, action) {
      const { title, text, type } = action.payload;
      const id = Date.now();
      state.messages.push({
        id,
        title,
        text,
        type,
      });
    },
    removeMessage(state, action) {
      const msg_id = action.payload;
      const index = state.messages.findIndex((msg) => msg.id === msg_id);
      state.messages.splice(index, 1);
    },
  },
});
export const { pushMessage, removeMessage } = toastSlice.actions;
export default toastSlice.reducer;
