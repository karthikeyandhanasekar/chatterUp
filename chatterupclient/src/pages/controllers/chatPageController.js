import { get, post } from "../../apiServices/apiServices";

export const getRoomDetailsController = async () => {
  try {
    const response = await get("/users/getRoom");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRoomMessagesController = async (id) => {
  try {
    const response = await get(`/users/roomMessage/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createMessageController = async (id, message) => {
  try {
    const response = await post(`/users/createMessage/${id}`, { message });
    return response;
  } catch (error) {
    throw error;
  }
};
