import React, { useState } from 'react';
import {
  FaHome,
  FaSignInAlt,
  FaChartLine,
  FaCalendarAlt,
  FaVideo,
  FaCog,
  FaPlusCircle,
  FaFileDownload,
  FaTimes,
  FaChevronRight,
  FaUserCheck,
  FaCode,
  FaKey,
  FaBook
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isMeetingsExpanded, setIsMeetingsExpanded] = useState(
    location.pathname === '/meetings' || location.pathname.startsWith('/meetings/')
  );

  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(
    location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/')
  );

  const [isDevelopersExpanded, setIsDevelopersExpanded] = useState(
    location.pathname === '/developers' || location.pathname.startsWith('/developers/')
  );

  return (
    <div
      className={`fixed top-0 left-0 bg-gradient-to-t from-black to-[#2F4F29] text-white w-72 h-screen p-6 overflow-y-auto z-50 transform transition-all duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 hide-scrollbar`}
    >
      {/* Close Button (Mobile) */}
      <div className="md:hidden absolute top-4 right-4">
        <button
          className="text-white hover:text-[#2F4F29] transition-colors focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaTimes size={24} />
        </button>
      </div>

      {/* Brand/Header */}
      <div className="mb-10 pt-2">
        <Link to="/">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-300">
            Meetix
          </h2>
        </Link>
        <div className="w-16 h-1 bg-teal-400 rounded-full mt-2"></div>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-2">
        {/* Landing Page */}
        {/* <li>
          <Link
            to="/"
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${location.pathname === '/'
                ? 'bg-[#2F4F29]       600 shadow-lg'
                : 'hover:bg-[#2F4F29]       700 hover:shadow-md hover:pl-4'
              }`}
          >
            <div className="flex items-center">
              <FaHome className="mr-3 text-teal-300" />
              <span>Home</span>
            </div>
            {location.pathname === '/' && <FaChevronRight className="text-sm opacity-70" />}
          </Link>
        </li> */}

        {/* Dashboard Pages (shown after login) */}
        <li className="pt-4 mt-4 border-t border-[#2F4F29]">
          <span className="text-xs font-semibold text-white uppercase tracking-wider pl-3">Dashboard</span>
        </li>

        <li>
          <div
            onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${location.pathname.startsWith('/dashboard')
                ? 'bg-[#2F4F29]  shadow-lg'
                : 'hover:bg-[#2F4F29]  hover:shadow-md hover:pl-4'
              }`}
          >
            <div className="flex items-center">
              <FaChartLine className="mr-3 text-teal-300" />
              <span>Plans & Analysis</span>
            </div>
            <FaChevronRight
              className={`text-sm opacity-70 transition-transform ${isAnalysisExpanded ? 'transform rotate-90' : ''}`}
            />
          </div>
        </li>

        {/* Analysis Submenu */}
        {isAnalysisExpanded && (
          <ul className="pl-6 mt-1 space-y-1">
            <li>
              <Link
                to="/dashboard/attendance"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/dashboard/attendance'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29] '
                  }`}
              >
                <FaUserCheck className="mr-2 text-xs" />
                <span>Attendance</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/chat-messages"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/dashboard/chat-messages'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29] '
                  }`}
              >
                <FaUserCheck className="mr-2 text-xs" />
                <span>Chat Messages</span>
              </Link>
            </li>
            {/* <li>
              <Link
                to="/dashboard/session"
                className={`flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/dashboard/session'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-[#2F4F29]       200 hover:bg-[#2F4F29]       700'
                  }`}
              >
                <FaUserCheck className="mr-2 text-xs" />
                <span>Sessions</span>
              </Link>
            </li> */}
            <li>
              <Link
                to="/dashboard/subscription-plans"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/dashboard/subscription-plans'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29]'
                  }`}
              >
                <FaKey className="mr-2 text-xs" />
                <span>Subscription Plans</span>
              </Link>
            </li>
          </ul>
        )}

        <li>
          <div
            onClick={() => setIsMeetingsExpanded(!isMeetingsExpanded)}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${location.pathname === '/meetings' || location.pathname.startsWith('/meetings/')
                ? 'bg-[#2F4F29]       600 shadow-lg'
                : 'hover:bg-[#2F4F29]       700 hover:shadow-md hover:pl-4'
              }`}
          >
            <div className="flex items-center">
              <FaCalendarAlt className="mr-3 text-teal-300" />
              <span>My Meetings</span>
            </div>
            <FaChevronRight
              className={`text-sm opacity-70 transition-transform ${isMeetingsExpanded ? 'transform rotate-90' : ''}`}
            />
          </div>
        </li>

        {/* Meeting Submenu */}
        {isMeetingsExpanded && (
          <ul className="pl-6 mt-1 space-y-1">
            <li>
              <Link
                to="http://localhost:3010"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/meetings/new'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29]'
                  }`}
              >
                <FaPlusCircle className="mr-2 text-xs" />
                <span>New Meeting</span>
              </Link>
            </li>
            <li>
              <Link
                to="/meetings/upcoming"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/meetings/upcoming'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29]'
                  }`}
              >
                <FaCalendarAlt className="mr-2 text-xs" />
                <span>Upcoming</span>
              </Link>
            </li>
            <li>
              <Link
                to="/meetings/completed"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/meetings/completed'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29]'
                  }`}
              >
                <FaVideo className="mr-2 text-xs" />
                <span>Completed</span>
              </Link>
            </li>
            <li>
              <Link
                to="/meetings/recordings"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/meetings/recordings'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29]'
                  }`}
              >
                <FaFileDownload className="mr-2 text-xs" />
                <span>Recordings</span>
              </Link>
            </li>
          </ul>
        )}

        <li className="pt-4 mt-4 border-t border-[#2F4F29]">
          <span className="text-xs font-semibold text-white uppercase tracking-wider pl-3">Developers</span>
        </li>

        <li>
          <div
            onClick={() => setIsDevelopersExpanded(!isDevelopersExpanded)}
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${location.pathname.startsWith('/developers')
                ? 'bg-[#2F4F29]       600 shadow-lg'
                : 'hover:bg-[#2F4F29]       700 hover:shadow-md hover:pl-4'
              }`}
          >
            <div className="flex items-center">
              <FaCode className="mr-3 text-teal-300" />
              <span>API Integration</span>
            </div>
            <FaChevronRight
              className={`text-sm opacity-70 transition-transform ${isDevelopersExpanded ? 'transform rotate-90' : ''}`}
            />
          </div>
        </li>

        {/* Developers Submenu */}
        {isDevelopersExpanded && (
          <ul className="pl-6 mt-1 space-y-1">
            <li>
              <Link
                to="/developers/documentation"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/developers/documentation'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29]'
                  }`}
              >
                <FaBook className="mr-2 text-xs" />
                <span>API Documentation</span>
              </Link>
            </li>
            <li>
              <Link
                to="/developers/generate-key"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/developers/generate-key'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29]'
                  }`}
              >
                <FaKey className="mr-2 text-xs" />
                <span>Generate API Key</span>
              </Link>
            </li>
            <li>
              <Link
                to="/developers/integration-guide"
                className={`text-white flex items-center p-2 text-sm rounded-lg transition-colors ${location.pathname === '/developers/integration-guide'
                    ? 'bg-teal-800 text-white font-medium'
                    : 'text-white hover:bg-[#2F4F29]'
                  }`}
              >
                <FaVideo className="mr-2 text-xs" />
                <span>Integration Guide</span>
              </Link>
            </li>
          </ul>
        )}

        {/* Settings */}
        {/* <li className="pt-4 mt-4 border-t border-[#2F4F29]       700">
          <Link 
            to="/settings"
            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
              location.pathname === '/settings' 
                ? 'bg-[#2F4F29]       600 shadow-lg' 
                : 'hover:bg-[#2F4F29]       700 hover:shadow-md hover:pl-4'
            }`}
          >
            <div className="flex items-center">
              <FaCog className="mr-3 text-teal-300" />
              <span>Settings</span>
            </div>
            {location.pathname === '/settings' && <FaChevronRight className="text-sm opacity-70" />}
          </Link>
        </li> */}
      </ul>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-transparent"></div>
    </div>
  );
};

export default Sidebar;