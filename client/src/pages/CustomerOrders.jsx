import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import { IoSearchOutline } from "react-icons/io5";
import { FaBox, FaTruck, FaCheck, FaTimes, FaClock, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaEye } from "react-icons/fa";
import { currencyConverter } from '../utils/currencyConverter';
import { useSelector } from 'react-redux';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  
  const user = useSelector(state => state?.user)

  // Add safety check for user state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in to view your orders</h2>
            <p className="text-gray-600">You need to be logged in to access your order history.</p>
          </div>
        </div>
      </div>
    )
  }

  const deliveryStatuses = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summery.getCustomerOrders,
        data: {
          search: searchTerm,
          deliveryStatus: statusFilter
        }
      })
      
      const { data: responseData } = response
      
      if (responseData?.success) {
        setOrders(responseData.data.orders || [])
      }
    } catch (error) {
      console.error("Order fetch error:", error)
      toast.error(error?.response?.data?.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchCustomerOrders()
    }
  }, [user?._id])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (user?._id) {
        fetchCustomerOrders()
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, statusFilter])

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-500" />,
      confirmed: <FaCheck className="text-blue-500" />,
      shipped: <FaTruck className="text-purple-500" />,
      delivered: <FaBox className="text-green-500" />,
      cancelled: <FaTimes className="text-red-500" />
    }
    return icons[status] || <FaClock className="text-gray-500" />
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getProgressPercentage = (status) => {
    const progress = {
      pending: 25,
      confirmed: 50,
      shipped: 75,
      delivered: 100,
      cancelled: 0
    }
    return progress[status] || 0
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleTrackOrder = (order) => {
    setSelectedOrder(order)
    setShowTrackingModal(true)
  }

  const OrderTrackingModal = () => {
    if (!selectedOrder) return null

    const statusSteps = [
      { 
        key: 'pending', 
        label: 'Order Placed', 
        icon: <FaClock />,
        description: 'Your order has been received and is being processed'
      },
      { 
        key: 'confirmed', 
        label: 'Order Confirmed', 
        icon: <FaCheck />,
        description: 'Your order has been confirmed and is being prepared'
      },
      { 
        key: 'shipped', 
        label: 'Shipped', 
        icon: <FaTruck />,
        description: 'Your order is on the way'
      },
      { 
        key: 'delivered', 
        label: 'Delivered', 
        icon: <FaBox />,
        description: 'Your order has been delivered successfully'
      }
    ]

    const currentStatusIndex = statusSteps.findIndex(step => step.key === selectedOrder.deliveryStatus)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Track Order</h2>
              <button 
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Order ID: {selectedOrder.orderId}</p>
          </div>

          <div className="p-6">
            {/* Order Status Progress */}
            <div className="mb-8">
              <div className="relative">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex
                  const isCancelled = selectedOrder.deliveryStatus === 'cancelled'
                  
                  return (
                    <div key={step.key} className="flex items-center mb-4 last:mb-0">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isCancelled ? 'bg-red-100 border-red-200 text-red-600' :
                        isCompleted ? 'bg-green-100 border-green-200 text-green-600' :
                        isCurrent ? 'bg-blue-100 border-blue-200 text-blue-600' :
                        'bg-gray-100 border-gray-200 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className={`font-medium ${
                          isCancelled ? 'text-red-600' :
                          isCompleted ? 'text-green-600' :
                          isCurrent ? 'text-blue-600' :
                          'text-gray-400'
                        }`}>
                          {step.label}
                        </h3>
                        <p className="text-sm text-gray-500">{step.description}</p>
                        {isCompleted && selectedOrder.deliveryDate && step.key === selectedOrder.deliveryStatus && (
                          <p className="text-xs text-gray-400 mt-1">
                            <FaCalendarAlt className="inline mr-1" />
                            {formatDate(selectedOrder.deliveryDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Product Details</h3>
                <div className="flex items-center">
                  <img
                    src={selectedOrder.productDetails?.image?.[0]}
                    alt={selectedOrder.productDetails?.name}
                    className="h-16 w-16 rounded object-cover mr-4"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg'
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedOrder.productDetails?.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {selectedOrder.quantity || 1}</p>
                    <p className="text-sm font-medium text-gray-900">{currencyConverter(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Delivery Details</h3>
                {selectedOrder.address && (
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-900">{selectedOrder.address.address_line}</p>
                        <p className="text-sm text-gray-500">
                          {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.pincode}
                        </p>
                        <p className="text-sm text-gray-500">{selectedOrder.address.country}</p>
                      </div>
                    </div>
                    {selectedOrder.address.mobile && (
                      <div className="flex items-center">
                        <FaPhone className="text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900">{selectedOrder.address.mobile}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Information */}
            {selectedOrder.trackingNumber && (
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Tracking Information</h3>
                <div className="flex items-center">
                  <FaEye className="text-blue-600 mr-2" />
                  <span className="text-sm font-mono text-blue-800">{selectedOrder.trackingNumber}</span>
                </div>
              </div>
            )}

            {/* Delivery Notes */}
            {selectedOrder.deliveryNotes && (
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Delivery Notes</h3>
                <p className="text-sm text-yellow-800">{selectedOrder.deliveryNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or product name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 min-w-[150px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {deliveryStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter ? 
                'Try adjusting your filters' : 
                'You haven\'t placed any orders yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div>
                        <h3 className="font-medium text-gray-900">Order #{order.orderId}</h3>
                        <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.deliveryStatus)}`}>
                        {getStatusIcon(order.deliveryStatus)}
                        <span className="ml-2 capitalize">{order.deliveryStatus}</span>
                      </span>
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FaEye className="mr-2" />
                        Track Order
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          order.deliveryStatus === 'cancelled' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${getProgressPercentage(order.deliveryStatus)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={order.productDetails?.image?.[0]}
                      alt={order.productDetails?.name}
                      className="h-20 w-20 rounded object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg'
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{order.productDetails?.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {order.quantity || 1}</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {currencyConverter(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        order.paymentStatus === 'cash on delivery' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tracking Modal */}
        {showTrackingModal && <OrderTrackingModal />}
      </div>
    </div>
  )
}

export default CustomerOrders
