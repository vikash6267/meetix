"use client"

import { useEffect, useState } from "react"
import Sidebar from "../Layouts/SideNav"
import Header from "../Layouts/SidebarHeader"
import { addUpcomingMeeting, getUpcomingMeetings } from "../../services/operations/user"
import { Calendar, Clock, Plus, Video, X, Users, FileText } from "lucide-react"

const UpcomingMeetingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [meetings, setMeetings] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [meetingName, setMeetingName] = useState("")
  const user = JSON.parse(localStorage.getItem("user"))

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Get current date and time for minimum values
  const getCurrentDateTime = () => {
    const now = new Date()
    const date = now.toISOString().split("T")[0]
    const time = now.toTimeString().slice(0, 5)
    return { date, time }
  }

  const { date: currentDate, time: currentTime } = getCurrentDateTime()

  // Filter upcoming meetings only
  const getUpcomingMeetingsOnly = (meetingsData) => {
    const now = new Date()
    return meetingsData.filter((meeting) => new Date(meeting.scheduleDateTime) > now)
  }

  // Format date and time for display
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime)

    return {
      date: date.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }),
    }
  }

  const handleCreateMeeting = async () => {
    if (!meetingName.trim()) {
      alert("Please enter a meeting name")
      return
    }

    if (!scheduleDate || !scheduleTime) {
      alert("Please select both date and time")
      return
    }

    const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}`)
    const now = new Date()

    if (selectedDateTime <= now) {
      alert("Please select a future date and time")
      return
    }

    const newMeeting = {
      meetingName: meetingName.trim(),
      roomId: `room_${Date.now()}`,
      scheduleDateTime: selectedDateTime.toISOString(),
      isJoined: false,
      joinedAt: null,
    }

    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")

    const result = await addUpcomingMeeting(user._id, newMeeting, token)

    if (result) {
      setMeetings((prev) => [...prev, newMeeting])
      setIsModalOpen(false)
      setScheduleDate("")
      setScheduleTime("")
      setMeetingName("")
    }
  }

  const handleJoinMeeting = (meetingId) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting._id === meetingId ? { ...meeting, isJoined: true, joinedAt: new Date().toISOString() } : meeting,
      ),
    )
  }

  const resetModal = () => {
    setIsModalOpen(false)
    setScheduleDate("")
    setScheduleTime("")
    setMeetingName("")
  }

  useEffect(() => {
    const fetchMeetings = async () => {
      if (user && user._id) {
        try {
          const res = await getUpcomingMeetings(user._id)
          console.log("Meetings data:", res)
          // Filter to show only upcoming meetings
          const upcomingOnly = getUpcomingMeetingsOnly(res || [])
          setMeetings(upcomingOnly)
        } catch (error) {
          console.error("Failed to fetch meetings:", error)
          setMeetings([])
        } finally {
          setLoading(false)
        }
      }
    }

    fetchMeetings()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} name="Upcoming Meetings" />
          <div className="flex-1 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} name="Upcoming Meetings" />

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Create Meeting Button */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Upcoming Meetings</h2>
              <p className="text-gray-600 mt-1">Manage and join your scheduled meetings</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Create Meeting
            </button>
          </div>

          {/* Meetings List */}
          {meetings.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-xl shadow-sm p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Upcoming Meetings</h3>
                <p className="text-gray-600 mb-6">Schedule your first meeting to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Create Meeting
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => {
                const { date, time } = formatDateTime(meeting.scheduleDateTime)
                const joinedTime = meeting.joinedAt ? formatDateTime(meeting.joinedAt) : null

                return (
                  <div
                    key={meeting._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-teal-200"
                  >
                    {/* Meeting Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                            {meeting.meetingName || "Untitled Meeting"}
                          </h3>
                          <p className="text-sm text-gray-500">Room ID: {meeting.roomId.slice(-8)}</p>
                        </div>
                      </div>
                      {meeting.isJoined && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          Joined
                        </div>
                      )}
                    </div>

                    {/* Meeting Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-800 block">{date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-800 block">{time}</span>
                        </div>
                      </div>
                      {meeting.isJoined && joinedTime && (
                        <div className="flex items-center gap-3 text-green-600">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-medium">Joined at {joinedTime.time}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100">
                      {meeting.isJoined ? (
                        <div className="text-center py-2">
                          <p className="text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Meeting joined successfully
                          </p>
                        </div>
                      ) : (
                        <a
                          // onClick={() => handleJoinMeeting(meeting._id)}
                          href={`https://meetix.mahitechnocrafts.in/join/?room=${meeting?.roomId}&id=${user?._id}`}
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                        >
                          <Video size={18} />
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Meeting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Schedule New Meeting</h3>
                <p className="text-sm text-gray-600 mt-1">Create a new meeting with custom details</p>
              </div>
              <button onClick={resetModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5">
              {/* Meeting Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={meetingName}
                    onChange={(e) => setMeetingName(e.target.value)}
                    placeholder="Enter meeting name (e.g., Team Standup, Client Review)"
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                    maxLength={100}
                  />
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <p className="text-xs text-gray-500 mt-1">{meetingName.length}/100 characters</p>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={currentDate}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    min={scheduleDate === currentDate ? currentTime : undefined}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={resetModal}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMeeting}
                disabled={!meetingName.trim() || !scheduleDate || !scheduleTime}
                className="flex-1 px-4 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpcomingMeetingPage
