import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import { IoSearchOutline } from "react-icons/io5";
import { FaFilter, FaEye, FaEdit, FaDownload } from "react-icons/fa";
import { currencyConverter } from '../utils/currencyConverter';
import UpdateOrderStatus from '../components/UpdateOrderStatus';

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    deliveryStatus: '',
    paymentStatus: '',
    startDate: '',
    endDate: ''
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const deliveryStatuses = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const paymentStatuses = [
    { value: '', label: 'All Payments' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'cash on delivery', label: 'Cash on Delivery' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summery.getAllOrders,
        data: {
          page,
          limit,
          ...filters
        }
      })
      
      const { data: responseData } = response
      
      if (responseData?.success) {
        setOrders(responseData.data.orders)
        setTotalPages(responseData.data.pagination.totalPages)
        setTotalOrders(responseData.data.pagination.totalOrders)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await Axios({
        ...summery.getOrderStats
      })
      
      const { data: responseData } = response
      
      if (responseData?.success) {
        setStats(responseData.data.overview)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page])

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (page === 1) {
        fetchOrders()
      } else {
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      deliveryStatus: '',
      paymentStatus: '',
      startDate: '',
      endDate: ''
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      'cash on delivery': 'bg-orange-100 text-orange-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order)
    setShowUpdateModal(true)
  }

  const handleStatusUpdated = () => {
    fetchOrders()
    fetchStats()
    setShowUpdateModal(false)
    setSelectedOrder(null)
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

  if (loading && orders.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-[1090px] overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
          <div className="bg-white p-3 rounded-lg shadow-sm border min-w-0">
            <p className="text-xs text-gray-600 truncate">Total Orders</p>
            <p className="text-lg font-bold text-gray-900 truncate">{stats.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border min-w-0">
            <p className="text-xs text-gray-600 truncate">Total Revenue</p>
            <p className="text-lg font-bold text-emerald-600 truncate" title={currencyConverter(stats.totalRevenue || 0)}>
              {currencyConverter(stats.totalRevenue || 0)}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border min-w-0">
            <p className="text-xs text-gray-600 truncate">Pending</p>
            <p className="text-lg font-bold text-yellow-600 truncate">{stats.pendingOrders || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border min-w-0">
            <p className="text-xs text-gray-600 truncate">Confirmed</p>
            <p className="text-lg font-bold text-blue-600 truncate">{stats.confirmedOrders || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border min-w-0">
            <p className="text-xs text-gray-600 truncate">Shipped</p>
            <p className="text-lg font-bold text-purple-600 truncate">{stats.shippedOrders || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border min-w-0">
            <p className="text-xs text-gray-600 truncate">Delivered</p>
            <p className="text-lg font-bold text-green-600 truncate">{stats.deliveredOrders || 0}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border min-w-0">
            <p className="text-xs text-gray-600 truncate">Cancelled</p>
            <p className="text-lg font-bold text-red-600 truncate">{stats.cancelledOrders || 0}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 min-w-0 max-w-md">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, products, tracking..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary200 focus:border-transparent"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaFilter className="text-gray-500" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary200"
                value={filters.deliveryStatus}
                onChange={(e) => handleFilterChange('deliveryStatus', e.target.value)}
              >
                {deliveryStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>

              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary200"
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              >
                {paymentStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>

              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary200"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                placeholder="Start Date"
              />

              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary200"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                placeholder="End Date"
              />
            </div>
            
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.userId?.name}</div>
                    <div className="text-sm text-gray-500">{order.userId?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={order.productDetails?.image?.[0]}
                        alt={order.productDetails?.name}
                        className="h-10 w-10 rounded object-cover mr-3"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.productDetails?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {order.quantity || 1}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {currencyConverter(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.deliveryStatus)}`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Update Status"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{((page - 1) * limit) + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(page * limit, totalOrders)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{totalOrders}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No Orders */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No orders found</div>
          <div className="text-gray-400 text-sm mt-2">
            {Object.values(filters).some(v => v) ? 
              'Try adjusting your filters' : 
              'Orders will appear here once customers place them'
            }
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedOrder && (
        <UpdateOrderStatus
          order={selectedOrder}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleStatusUpdated}
        />
      )}
    </div>
  )
}

export default AdminOrders
