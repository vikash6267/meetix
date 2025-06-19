const express = require("express");
const router = express.Router();
const {
  addUpcomingMeeting,
  getUpcomingMeetings,
  updateUpcomingMeeting,
  deleteUpcomingMeeting,
} = require("../controllers/userCtrl");
const User = require("../models/User");

// 🔹 Add an upcoming meeting
router.post("/create/:userId", addUpcomingMeeting);

// 🔹 Get all upcoming meetings
router.get("/getAll/:userId", getUpcomingMeetings);

// 🔹 Update a meeting
router.put("/:userId/upcoming-meetings/:meetingId", updateUpcomingMeeting);

// 🔹 Delete a meeting
router.delete("/delete/:userId/:meetingId", deleteUpcomingMeeting);





router.post("/testmeeting", async (req, res) => {
  try {
    const { roomId, testmittingValue } = req.body;

    if (!roomId || !testmittingValue) {
      return res.status(400).json({
        success: false,
        message: "roomId and testmittingValue are required.",
      });
    }

    // Find user by meeting roomId and populate subscription.service
    const user = await User.findOne({ "meetings.roomId": roomId }).populate("subscriptions.service");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with given meeting not found.",
      });
    }

    // Update testmitting field
    user.testmitting = testmittingValue;
    await user.save();

    // Check for valid (not expired + active) subscription
    const now = new Date();
    const validSubscription = user.subscriptions.find(sub => {
      return (
        sub.isActive &&
        (!sub.expirationDate || new Date(sub.expirationDate) > now)
      );
    });

    res.status(200).json({
      success: true,
      message: "testmitting updated successfully.",
      isSubscription: !!validSubscription, // true or false
      subscription: validSubscription || null,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        testmitting: user.testmitting,
      },
    });
  } catch (err) {
    console.error("Error in /testmeeting:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/save-recording", async (req, res) => {
  try {
    const { roomId, url, fileName, size, codecs, device, storedType, duration } = req.body;

    if (!roomId || !url) {
      return res.status(400).json({ success: false, message: "roomId and url are required." });
    }

    const user = await User.findOne({ "meetings.roomId": roomId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User with given roomId not found." });
    }

    // Push new recording with all metadata
    user.recordings.push({
      roomId,
      url,
      fileName,
      size,
      codecs,
      device,
      storedType: storedType || "Locally",
      duration
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Recording and metadata saved successfully.",
      recordings: user.recordings
    });
  } catch (err) {
    console.error("Error saving recording:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




router.get("/recordings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Recordings fetched successfully",
      recordings: user.recordings || [],
    });
  } catch (err) {
    console.error("Error fetching recordings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = router;
