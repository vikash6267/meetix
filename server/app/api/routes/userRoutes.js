const express = require("express");
const router = express.Router();
const {
  addUpcomingMeeting,
  getUpcomingMeetings,
  updateUpcomingMeeting,
  deleteUpcomingMeeting,
} = require("../controllers/userCtrl");

// 🔹 Add an upcoming meeting
router.post("/create/:userId", addUpcomingMeeting);

// 🔹 Get all upcoming meetings
router.get("/getAll/:userId", getUpcomingMeetings);

// 🔹 Update a meeting
router.put("/:userId/upcoming-meetings/:meetingId", updateUpcomingMeeting);

// 🔹 Delete a meeting
router.delete("/delete/:userId/:meetingId", deleteUpcomingMeeting);

module.exports = router;
