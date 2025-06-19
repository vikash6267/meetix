"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "../../components/Layouts/SideNav"
import Header from "../../components/Layouts/SidebarHeader"
import { BASE_URL } from "../../services/apis"

const SubscriptionDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("type")

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const openSubscriptionModal = (subscription) => {
    setSelectedSubscription(subscription)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSubscription(null)
  }

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/subscription/all`)
        console.log(res.data.subscriptions)
        setSubscriptions(res.data.subscriptions)
        setFilteredSubscriptions(res.data.subscriptions)
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  // Filter and Search Logic
  useEffect(() => {
    let filtered = subscriptions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Type filter
    if (filterType !== "all") {
      if (filterType === "active") {
        filtered = filtered.filter((sub) => sub.isActive)
      } else if (filterType === "inactive") {
        filtered = filtered.filter((sub) => !sub.isActive)
      } else {
        filtered = filtered.filter((sub) => sub.type.toLowerCase() === filterType.toLowerCase())
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "type":
          return a.type.localeCompare(b.type)
        case "price":
          return b.rate - a.rate
        case "users":
          return b.usersEnroled.length - a.usersEnroled.length
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })

    setFilteredSubscriptions(filtered)
  }, [subscriptions, searchTerm, filterType, sortBy])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSubscriptionColor = (type) => {
    switch (type.toLowerCase()) {
      case "free":
        return "from-green-400 to-green-600"
      case "pro":
        return "from-blue-400 to-blue-600"
      case "business":
        return "from-purple-400 to-purple-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const totalUsers = subscriptions.reduce((sum, sub) => sum + sub.usersEnroled.length, 0)
  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive).length
  const totalRevenue = subscriptions.reduce(
    (sum, sub) => sum + sub.usersEnroled.length * Number.parseFloat(sub.rate || 0),
    0,
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} name="Subscription Management" />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{subscriptions.length}</p>
                  <p className="text-sm text-gray-500">Total Plans</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{activeSubscriptions}</p>
                  <p className="text-sm text-gray-500">Active Plans</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {["all", "free", "pro", "business", "active", "inactive"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterType(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterType === filter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="type">Sort by Type</option>
                <option value="price">Sort by Price</option>
                <option value="users">Sort by Users</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>

          {/* Subscription Cards */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubscriptions.map((subscription) => (
                <div
                  key={subscription._id}
                  onClick={() => openSubscriptionModal(subscription)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className={`h-2 bg-gradient-to-r ${getSubscriptionColor(subscription.type)}`}></div>

                  <div className="p-6">
                    {/* Plan Type and Status */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{subscription.type}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.isActive)}`}
                      >
                        {subscription.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-800">${subscription.rate}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{subscription.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{subscription.usersEnroled.length}</p>
                        <p className="text-xs text-gray-500">Enrolled Users</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          ${(subscription.usersEnroled.length * Number.parseFloat(subscription.rate || 0)).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        <span className="font-medium">Created:</span> {formatDate(subscription.createdAt)}
                      </p>
                      <p>
                        <span className="font-medium">Period:</span> {formatDate(subscription.startDate)} -{" "}
                        {formatDate(subscription.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredSubscriptions.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg">No subscriptions found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${getSubscriptionColor(selectedSubscription.type)} mr-3`}
                  ></div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedSubscription.type} Plan Details</h2>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Plan Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Plan Details</h3>
                  <p className="text-3xl font-bold text-blue-900 mb-1">${selectedSubscription.rate}</p>
                  <p className="text-blue-700 text-sm">per month</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedSubscription.isActive)}`}
                  >
                    {selectedSubscription.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="font-semibold text-green-800 mb-2">Enrolled Users</h3>
                  <p className="text-3xl font-bold text-green-900 mb-1">{selectedSubscription.usersEnroled.length}</p>
                  <p className="text-green-700 text-sm">total subscribers</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
                  <h3 className="font-semibold text-purple-800 mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-purple-900 mb-1">
                    $
                    {(
                      selectedSubscription.usersEnroled.length * Number.parseFloat(selectedSubscription.rate || 0)
                    ).toFixed(2)}
                  </p>
                  <p className="text-purple-700 text-sm">from this plan</p>
                </div>
              </div>

              {/* Plan Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Plan Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Plan ID:</span>
                      <p className="text-gray-800 font-mono text-sm">{selectedSubscription._id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Description:</span>
                      <p className="text-gray-800">{selectedSubscription.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                      <p className="text-gray-800">${selectedSubscription.totalAmount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Timeline</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Created:</span>
                      <p className="text-gray-800">{formatDateTime(selectedSubscription.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Start Date:</span>
                      <p className="text-gray-800">{formatDateTime(selectedSubscription.startDate)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">End Date:</span>
                      <p className="text-gray-800">{formatDateTime(selectedSubscription.endDate)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                      <p className="text-gray-800">{formatDateTime(selectedSubscription.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrolled Users */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  Enrolled Users ({selectedSubscription.usersEnroled.length})
                </h4>
                {selectedSubscription.usersEnroled.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Enrollment Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Expiration Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount Paid
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Transaction ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedSubscription.usersEnroled.map((user, index) => {
                            const isExpired = new Date(user.expirationDate) < new Date()
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                  {user?.user?.username || "N/A"} 
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatDateTime(user.enrollmentDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatDateTime(user.expirationDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.payable}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                  {user.transaction_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {isExpired ? "Expired" : "Active"}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <p className="text-gray-500">No users enrolled yet</p>
                    <p className="text-gray-400 text-sm">Users will appear here when they subscribe to this plan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionDashboard
