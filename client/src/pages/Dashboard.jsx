import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import Axios from '../utils/Axios'
import summery from '../common/summery'
import IsAdmin from '../components/IsAdmin'
import { 
  FaShoppingCart, 
  FaUsers, 
  FaBox, 
  FaDollarSign, 
  FaTruck, 
  FaCheck, 
  FaClock, 
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaEye
} from "react-icons/fa";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { currencyConverter } from '../utils/currencyConverter';

const AdminDashboard = () => {
  const user = useSelector(state => state?.user)
  const [stats, setStats] = useState({})
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState([])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch order statistics
      const statsResponse = await Axios({
        ...summery.getOrderStats
      })
      
      if (statsResponse?.data?.success) {
        setStats(statsResponse.data.data.overview || {})
        
        // Process current month daily data for charts
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentYear = currentDate.getFullYear()
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
        
        // Generate daily data for current month
        const dailyData = []
        for (let day = 1; day <= daysInMonth; day++) {
          // This is sample data - in real implementation, you'd fetch actual daily data
          const revenue = Math.floor(Math.random() * 5000) + 1000
          const orders = Math.floor(Math.random() * 50) + 10
          
          dailyData.push({
            day: day,
            date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            revenue: revenue,
            orders: orders,
            dayName: `${String(day).padStart(2, '0')}`
          })
        }
        setMonthlyData(dailyData)
      }

      // Fetch recent orders
      const ordersResponse = await Axios({
        ...summery.getAllOrders,
        data: { page: 1, limit: 5 }
      })
      
      if (ordersResponse?.data?.success) {
        setRecentOrders(ordersResponse.data.data.orders || [])
      }

    } catch (error) {
      toast.error("Failed to fetch dashboard data")
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && IsAdmin(user.role)) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [user])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // Sample data for pie chart
  const orderStatusData = [
    { name: 'Pending', value: stats.pendingOrders || 0, color: '#fbbf24' },
    { name: 'Confirmed', value: stats.confirmedOrders || 0, color: '#3b82f6' },
    { name: 'Shipped', value: stats.shippedOrders || 0, color: '#8b5cf6' },
    { name: 'Delivered', value: stats.deliveredOrders || 0, color: '#10b981' },
    { name: 'Cancelled', value: stats.cancelledOrders || 0, color: '#ef4444' }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600">{`Day: ${label}`}</p>
          <p className="text-blue-600 font-semibold">
            {`Revenue: ${currencyConverter(payload[0].value)}`}
          </p>
          {payload[1] && (
            <p className="text-green-600 font-semibold">
              {`Orders: ${payload[1].value}`}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // If user is not admin, show customer dashboard
  if (!IsAdmin(user?.role)) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <FaBox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h1>
            <p className="text-gray-600 mb-8">Manage your orders and account settings from here.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <FaShoppingCart className="mx-auto h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Orders</h3>
                <p className="text-gray-600 mb-4">Track your orders and delivery status</p>
                <a href="/dashboard/myorders" className="text-blue-600 hover:text-blue-700 font-medium">
                  View Orders →
                </a>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <FaUsers className="mx-auto h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Profile</h3>
                <p className="text-gray-600 mb-4">Update your personal information</p>
                <a href="/dashboard/profile" className="text-green-600 hover:text-green-700 font-medium">
                  Edit Profile →
                </a>
              </div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-[1100px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {currencyConverter(stats.totalRevenue || 0)}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <FaArrowUp className="mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaDollarSign className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders || 0}</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <FaArrowUp className="mr-1" />
                +5.2% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaShoppingCart className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders || 0}</p>
              <p className="text-xs text-yellow-600 mt-1 flex items-center">
                <FaClock className="mr-1" />
                Needs attention
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.deliveredOrders || 0}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <FaCheck className="mr-1" />
                Completed successfully
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheck className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Daily Revenue - {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <div className="flex items-center text-sm text-gray-500">
              <FaEye className="mr-1" />
              Current month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dayName" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Status Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <a href="/dashboard/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all orders
            </a>
          </div>
        </div>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.userId?.name}</div>
                    <div className="text-sm text-gray-500">{order.userId?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={order.productDetails?.image?.[0]}
                        alt={order.productDetails?.name}
                        className="h-8 w-8 rounded object-cover mr-3"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'
                        }}
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {order.productDetails?.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {currencyConverter(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.deliveryStatus)}`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
