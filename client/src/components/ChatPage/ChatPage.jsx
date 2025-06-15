import React, { useState } from 'react';
import Sidebar from '../Layouts/SideNav';
import Header from '../Layouts/SidebarHeader';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const fetchChat = async (e) => {
    e.preventDefault();
    if (!roomId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3010/chat/${roomId}`);
      if (!response.ok) throw new Error('Failed to fetch chat data');
      
      const data = await response.json();
      // Sort messages by timestamp in ascending order
      const sortedData = data.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      setChatData(sortedData);
    } catch (err) {
      setError('Failed to fetch chat history. Please check the room ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="Chat History" />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={fetchChat} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Loading...' : 'View Chat'}
                </button>
              </div>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {chatData.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Chat History for Room: {roomId}
                </h2>
                <div className="space-y-4">
                  {chatData.map((message) => (
                    <div 
                      key={message._id}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-700">
                          {message.senderName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-800">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !loading && !error && (
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                  <p className="text-gray-600">Enter a Room ID to view chat history</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;