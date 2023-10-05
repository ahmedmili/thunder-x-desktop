import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Message } from "../../services/types";
import { AppDispatch } from "../store";
import { userService } from "../../services/api/user.api";
import eventEmitter from "../../services/thunderEventsService";

export type MessangerState = {
  loading: boolean;
  isOpen: boolean;
  error: any;
  unReadedMessages: number;
  messagesList: Message[];
};

const initialState: MessangerState = {
  loading: false,
  isOpen: false,
  error: null,
  unReadedMessages: 0,
  messagesList: [],
};

const messangerSlice = createSlice({
  name: "messanger",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    handleMessanger: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessangerSuccess: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      state.loading = false;
      state.error = null;
      state.isOpen ? (state.unReadedMessages = 0) : (state.unReadedMessages = state.unReadedMessages + 1)
      state.messagesList = [...state.messagesList, message]
    },
    addMessangerError: (state, action: PayloadAction<any>) => {
      const error = action.payload;
      state.loading = false;
      state.error = error;
    },
    getMessangerError: (state, action: PayloadAction<any>) => {
      const error = action.payload;
      state.loading = false;
      state.error = error;
    },
    getMessagesSuccess: (state, action: PayloadAction<Message[]>) => {
      const messages = action.payload;
      state.loading = false;
      state.messagesList = messages;
    },
    addUnReadedMessage: (state) => {
      state.loading = false;
      state.isOpen === false && (state.unReadedMessages = state.unReadedMessages + 1)
    },
    initUnReadedMessage: (state) => {
      state.loading = false;
      state.isOpen && (state.unReadedMessages = 0)
    },
  },
});
export const {
  startLoading,
  handleMessanger,
  initUnReadedMessage,
  addUnReadedMessage,
  addMessangerSuccess,
  addMessangerError,
  getMessangerError,
  getMessagesSuccess,
} = messangerSlice.actions;

const messangerReducer = messangerSlice.reducer;
export default messangerReducer;

export const messangerSelector = (state: RootState) => state.messanger;
export const messagesSelector = (state: RootState) => state.messanger.messagesList;
export const unReadMessages = (state: RootState) => state.messanger.unReadedMessages;
export const messangerErrors = (state: RootState) => state.messanger.error;
export const messagesLoding = (state: RootState) => state.messanger.loading;

// Action



export const fetchMessages = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());
    const { status, data } = await userService.fetchMessages()
    let response = data.data.messages
    let messagesArray: Message[] = []
    response.reverse().map((message: any) => {
      messagesArray.push(message)
    })
    dispatch(getMessagesSuccess(data.data.messages));
    return data
  } catch (error) {
    dispatch(getMessangerError(error));
  }
};

