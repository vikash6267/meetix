const User = require("../models/User");

// 🔹 Add an upcoming meeting
exports.addUpcomingMeeting = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roomId, scheduleDateTime, isJoined, joinedAt,meetingName } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.upCommingMeetings.push({ roomId,meetingName, scheduleDateTime, isJoined, joinedAt });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Upcoming meeting added successfully",
      upCommingMeetings: user.upCommingMeetings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getUpcomingMeetings = async (req, res) => {
  try {
    const { userId } = req.params;
console.log(userId)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Upcoming meetings fetched successfully",
      upCommingMeetings: user.upCommingMeetings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Update a specific upcoming meeting
exports.updateUpcomingMeeting = async (req, res) => {
  try {
    const { userId, meetingId } = req.params;
    const { roomId, scheduleDateTime } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const meeting = user.upCommingMeetings.id(meetingId);
    if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

    if (roomId !== undefined) meeting.roomId = roomId;
    if (scheduleDateTime !== undefined) meeting.scheduleDateTime = scheduleDateTime;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Upcoming meeting updated successfully",
      meeting,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Delete a specific upcoming meeting
exports.deleteUpcomingMeeting = async (req, res) => {
  try {
    const { userId, meetingId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const meeting = user.upCommingMeetings.id(meetingId);
    if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

    meeting.remove();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Upcoming meeting deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
