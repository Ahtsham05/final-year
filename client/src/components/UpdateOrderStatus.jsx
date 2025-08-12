import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { IoClose } from 'react-icons/io5'
import Axios from '../utils/Axios'
import summery from '../common/summery'

const UpdateOrderStatus = ({ order, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    deliveryStatus: order.deliveryStatus || 'pending',
    trackingNumber: order.trackingNumber || '',
    deliveryNotes: order.deliveryNotes || ''
  })
  const [loading, setLoading] = useState(false)

  const deliveryStatuses = [
    { value: 'pending', label: 'Pending', description: 'Order received and being processed' },
    { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed and ready for preparation' },
    { value: 'shipped', label: 'Shipped', description: 'Order dispatched and on the way' },
    { value: 'delivered', label: 'Delivered', description: 'Order successfully delivered' },
    { value: 'cancelled', label: 'Cancelled', description: 'Order cancelled' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await Axios({
        ...summery.updateOrderStatus,
        data: {
          orderId: order._id,
          ...formData
        }
      })

      const { data: responseData } = response

      if (responseData?.success) {
        toast.success('Order status updated successfully')
        onUpdate()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      confirmed: 'text-blue-600 bg-blue-50 border-blue-200',
      shipped: 'text-purple-600 bg-purple-50 border-purple-200',
      delivered: 'text-green-600 bg-green-50 border-green-200',
      cancelled: 'text-red-600 bg-red-50 border-red-200'
    }
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Order Status</h2>
            <p className="text-sm text-gray-500 mt-1">Order ID: {order.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Order Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {order.userId?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {order.userId?.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {order.userId?.phone}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Product Information</h3>
              <div className="flex items-center space-x-3">
                <img
                  src={order.productDetails?.image?.[0]}
                  alt={order.productDetails?.name}
                  className="h-12 w-12 rounded object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.productDetails?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {order.quantity || 1}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Delivery Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Status
              </label>
              <div className="space-y-3">
                {deliveryStatuses.map((status) => (
                  <label
                    key={status.value}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.deliveryStatus === status.value
                        ? getStatusColor(status.value)
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryStatus"
                      value={status.value}
                      checked={formData.deliveryStatus === status.value}
                      onChange={handleInputChange}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-sm">{status.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {status.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Tracking Number */}
            {(formData.deliveryStatus === 'shipped' || formData.deliveryStatus === 'delivered') && (
              <div>
                <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleInputChange}
                  placeholder="Enter tracking number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary200 focus:border-transparent"
                />
              </div>
            )}

            {/* Delivery Notes */}
            <div>
              <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Notes <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="deliveryNotes"
                name="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add any notes about the delivery..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary200 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary200 text-white rounded-lg hover:bg-primary300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateOrderStatus
