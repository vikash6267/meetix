import React, { useEffect, useState } from 'react';
import Sidebar from '../Layouts/SideNav';
import Header from '../Layouts/SidebarHeader';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const SubscripationPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:3010/api/v1/subscription/my-subscriptions",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSubscriptions(data?.subscriptions || []);
      } catch (error) {
        console.error(error?.response?.data || error?.message || error);
        toast.error(
          error?.response?.data?.message || "Failed to fetch subscriptions."
        );
      }
    };

    fetchSubscriptions();
  }, [token]);

  const getStatusBadge = (isActive) => (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
      isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
    }`}>
      {isActive ? 'Active' : 'Expired'}
    </span>
  );

  const formatDate = (date) => dayjs(date).format('DD MMM YYYY');
  const daysBetween = (from, to) => Math.ceil(dayjs(to).diff(dayjs(from), 'day'));

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} name="Subscriptions" />

        <div className="flex-1 overflow-auto p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Subscriptions</h1>

            {subscriptions?.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-lg text-gray-600">No subscriptions found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {subscriptions?.map((sub, index) => {
                  const enrollDate = sub?.enrollmentDate;
                  const expireDate = sub?.expirationDate;
                  const now = dayjs();
                  const daysSinceEnroll = daysBetween(enrollDate, now);
                  const daysToExpire = daysBetween(now, expireDate);
                  const isExpired = dayjs().isAfter(expireDate);

                  return (
                    <div
                      key={sub?._id || index}
                      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-200"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="mb-4 md:mb-0">
                          <h2 className="text-2xl font-semibold text-gray-800">
                            {sub?.service?.type || 'Unknown Plan'}
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">{getStatusBadge(sub?.isActive)}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-blue-600 font-semibold text-xl">
                            ${sub?.payable ?? '0'} / month
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                        <div>
                          <p className="font-medium text-gray-600">Subscribed On</p>
                          <p>{formatDate(enrollDate)}</p>
                          <p className="text-xs text-gray-500">{dayjs(enrollDate).fromNow()}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">Days Since Subscribed</p>
                          <p>{daysSinceEnroll} days</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">Expires On</p>
                          <p>{formatDate(expireDate)}</p>
                          <p className={`text-xs ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                            {isExpired
                              ? `${Math.abs(daysToExpire)} days ago`
                              : `in ${daysToExpire} days`}
                          </p>
                        </div>
                      </div>

                   {isExpired && (
  <button
    onClick={() => toast.info("Renew feature coming soon.")}
    className="mt-6 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-md transition"
  >
    Renew Plan
  </button>
)}


                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscripationPage;
