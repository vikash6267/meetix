

import { apiConnector } from "../apiConnector";
import { userEndpoints} from "../apis";
import { toast } from "react-toastify";


const {
   ADD_UPCOMING_MEETING_API,
   DELETE_SCHEDULE_MEETING,
   GET_SCHEDULE_MEETING,
   GET_MEETINGS_ACTIVITY
} = userEndpoints;

export const addUpcomingMeeting = async (userId, data, token) => {
  const toastId = toast.loading("Creating meeting...");
  let success = false;

  try {
    const res = await apiConnector("POST", `${ADD_UPCOMING_MEETING_API}/${userId}`, data, {
      Authorization: `Bearer ${token}`,
    });

    toast.success("Meeting created");
    success = true;
  } catch (err) {
    console.error("Add Meeting Error:", err);
    toast.error(err?.response?.data?.message || "Failed to create meeting");
  }

  toast.dismiss(toastId);
  return success;
};



export const updateUpcomingMeeting = async (userId, meetingId, data, token) => {
  const toastId = toast.loading("Updating meeting...");
  let result = false;

  try {
    const response = await apiConnector("PUT", `${DELETE_SCHEDULE_MEETING}/${userId}/${meetingId}`, data, {
      Authorization: `Bearer ${token}`,
    });

    toast.success("Meeting updated successfully");
    result = true;
  } catch (error) {
    console.error("Update Meeting Error:", error);
    toast.error(error?.response?.data?.message || "Failed to update meeting");
  }

  toast.dismiss(toastId);
  return result;
};


export const getUpcomingMeetings = async (userId, token) => {
  const toastId = toast.loading("Fetching upcoming meetings...");
  let meetings = [];

  try {
    const response = await apiConnector("GET", `${GET_SCHEDULE_MEETING}/${userId}`, null, {
      Authorization: `Bearer ${token}`,
    });

    meetings = response?.data?.upCommingMeetings || [];
    toast.success("Upcoming meetings fetched");
  } catch (error) {
    console.error("Fetch Meetings Error:", error);
    toast.error(error?.response?.data?.message || "Failed to fetch meetings");
  }

  toast.dismiss(toastId);
  return meetings;
};


export const getActivityMeetings = async (userId, token) => {
  const toastId = toast.loading("Fetching upcoming meetings...");
  let meetings = [];

  try {
    const response = await apiConnector("GET", `${GET_MEETINGS_ACTIVITY}/${userId}`, null, {
      Authorization: `Bearer ${token}`,
    });

    meetings = response?.data || [];
    toast.success("Upcoming meetings fetched");
  } catch (error) {
    console.error("Fetch Meetings Error:", error);
    toast.error(error?.response?.data?.message || "Failed to fetch meetings");
  }

  toast.dismiss(toastId);
  return meetings;
};



  export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
  
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    
    }
  }
  