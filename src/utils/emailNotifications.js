import { showMessage } from './message'

export class EmailNotificationService {
  constructor() {
    this.emailTemplates = {
      orderConfirmation: {
        subject: 'Order Confirmation - #{orderId}',
        template: 'order-confirmation'
      },
      paymentConfirmed: {
        subject: 'Payment Confirmed - Order #{orderId}',
        template: 'payment-confirmed'
      },
      orderProcessing: {
        subject: 'Your Order is Being Processed - #{orderId}',
        template: 'order-processing'
      },
      orderShipped: {
        subject: 'Your Order Has Shipped - #{orderId}',
        template: 'order-shipped'
      },
      orderDelivered: {
        subject: 'Order Delivered - #{orderId}',
        template: 'order-delivered'
      },
      orderCancelled: {
        subject: 'Order Cancelled - #{orderId}',
        template: 'order-cancelled'
      },
      reviewReminder: {
        subject: 'How was your recent purchase? - #{orderId}',
        template: 'review-reminder'
      }
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(order, customerEmail) {
    const emailData = {
      type: 'orderConfirmation',
      orderId: order.id,
      customerEmail,
      customerName: order.customer_name,
      orderTotal: order.total,
      orderItems: order.items || [],
      orderDate: new Date(order.created_at).toLocaleDateString(),
      paymentMethod: order.payment_method,
      estimatedDelivery: this.getEstimatedDelivery(order)
    }

    return this.sendEmail(emailData)
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(order, customerEmail) {
    const emailData = {
      type: 'paymentConfirmed',
      orderId: order.id,
      customerEmail,
      customerName: order.customer_name,
      orderTotal: order.total,
      paymentMethod: order.payment_method,
      paymentId: order.payment_id,
      nextSteps: [
        'Your order will be processed within 1-2 business days',
        'You will receive tracking information once shipped',
        'Contact support if you have any questions'
      ]
    }

    return this.sendEmail(emailData)
  }

  /**
   * Send order processing notification
   */
  async sendOrderProcessing(order, customerEmail) {
    const emailData = {
      type: 'orderProcessing',
      orderId: order.id,
      customerEmail,
      customerName: order.customer_name,
      estimatedShipping: this.getEstimatedShipping(order),
      processingSteps: [
        'Items being picked from warehouse',
        'Quality check and packaging',
        'Preparing shipping label'
      ]
    }

    return this.sendEmail(emailData)
  }

  /**
   * Send shipping notification
   */
  async sendShippingNotification(order, customerEmail, trackingNumber) {
    const emailData = {
      type: 'orderShipped',
      orderId: order.id,
      customerEmail,
      customerName: order.customer_name,
      trackingNumber,
      carrier: 'FedEx Express',
      estimatedDelivery: this.getEstimatedDelivery(order),
      trackingUrl: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      shippingAddress: order.shipping_address || {
        city: order.city,
        country: order.country
      }
    }

    return this.sendEmail(emailData)
  }

  /**
   * Send delivery confirmation
   */
  async sendDeliveryConfirmation(order, customerEmail) {
    const emailData = {
      type: 'orderDelivered',
      orderId: order.id,
      customerEmail,
      customerName: order.customer_name,
      deliveryDate: new Date().toLocaleDateString(),
      orderItems: order.items || [],
      supportActions: [
        'Rate your shopping experience',
        'Leave a product review',
        'Contact support if needed'
      ]
    }

    return this.sendEmail(emailData)
  }

  /**
   * Send cancellation notification
   */
  async sendCancellationNotification(order, customerEmail, reason = '') {
    const emailData = {
      type: 'orderCancelled',
      orderId: order.id,
      customerEmail,
      customerName: order.customer_name,
      cancellationReason: reason,
      refundAmount: order.total,
      refundMethod: order.payment_method,
      refundTimeline: this.getRefundTimeline(order.payment_method)
    }

    return this.sendEmail(emailData)
  }

  /**
   * Send review reminder email
   */
  async sendReviewReminder(order, customerEmail) {
    const emailData = {
      type: 'reviewReminder',
      orderId: order.id,
      customerEmail,
      customerName: order.customer_name,
      orderItems: order.items || [],
      reviewIncentive: 'Get 10% off your next order when you leave a review!',
      reviewUrl: `${window.location.origin}/order/${order.id}#review`
    }

    // Send review reminder 3 days after delivery
    setTimeout(() => {
      return this.sendEmail(emailData)
    }, 3 * 24 * 60 * 60 * 1000) // 3 days
  }

  /**
   * Core email sending function (simulated)
   */
  async sendEmail(emailData) {
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Log email details for development
      console.log('📧 Email Notification Sent:', {
        to: emailData.customerEmail,
        subject: this.getEmailSubject(emailData),
        type: emailData.type,
        data: emailData
      })

      // Simulate email content for preview
      const emailContent = this.generateEmailContent(emailData)
      console.log('Email Content Preview:', emailContent)

      // Show success notification
      showMessage(
        `Email sent to ${emailData.customerEmail} - ${this.getEmailSubject(emailData)}`,
        'success'
      )

      // Store email in localStorage for demo purposes
      this.storeEmailNotification(emailData)

      return {
        success: true,
        messageId: 'msg_' + Date.now(),
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      showMessage('Failed to send email notification', 'error')
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate email subject line
   */
  getEmailSubject(emailData) {
    const template = this.emailTemplates[emailData.type]
    if (!template) return 'Order Update'
    
    return template.subject.replace('{orderId}', emailData.orderId)
  }

  /**
   * Generate email content preview
   */
  generateEmailContent(emailData) {
    const content = {
      subject: this.getEmailSubject(emailData),
      greeting: `Hello ${emailData.customerName},`,
      body: this.getEmailBody(emailData),
      footer: 'Thank you for choosing our store!',
      unsubscribeLink: `${window.location.origin}/unsubscribe`,
      supportEmail: 'support@store.com'
    }

    return content
  }

  /**
   * Generate email body content based on type
   */
  getEmailBody(emailData) {
    switch (emailData.type) {
      case 'orderConfirmation':
        return `
          <h2>Your order has been confirmed!</h2>
          <p>Thank you for your purchase. Here are your order details:</p>
          <ul>
            <li><strong>Order ID:</strong> #${emailData.orderId}</li>
            <li><strong>Total:</strong> $${emailData.orderTotal}</li>
            <li><strong>Payment Method:</strong> ${emailData.paymentMethod}</li>
            <li><strong>Estimated Delivery:</strong> ${emailData.estimatedDelivery}</li>
          </ul>
          <p>We'll send you updates as your order progresses.</p>
        `

      case 'paymentConfirmed':
        return `
          <h2>Payment confirmed successfully!</h2>
          <p>Your payment of $${emailData.orderTotal} has been processed.</p>
          <p><strong>Payment ID:</strong> ${emailData.paymentId}</p>
          <h3>What happens next:</h3>
          <ul>
            ${emailData.nextSteps.map(step => `<li>${step}</li>`).join('')}
          </ul>
        `

      case 'orderProcessing':
        return `
          <h2>Your order is being processed!</h2>
          <p>Great news! We've started preparing your order #${emailData.orderId}.</p>
          <h3>Current progress:</h3>
          <ul>
            ${emailData.processingSteps.map(step => `<li>${step}</li>`).join('')}
          </ul>
          <p>Estimated shipping: ${emailData.estimatedShipping}</p>
        `

      case 'orderShipped':
        return `
          <h2>Your order is on the way!</h2>
          <p>Your order #${emailData.orderId} has been shipped via ${emailData.carrier}.</p>
          <p><strong>Tracking Number:</strong> ${emailData.trackingNumber}</p>
          <p><strong>Estimated Delivery:</strong> ${emailData.estimatedDelivery}</p>
          <p><a href="${emailData.trackingUrl}" style="color: #007bff;">Track your package</a></p>
        `

      case 'orderDelivered':
        return `
          <h2>Your order has been delivered!</h2>
          <p>Your order #${emailData.orderId} was delivered on ${emailData.deliveryDate}.</p>
          <p>We hope you're happy with your purchase!</p>
          <h3>What you can do now:</h3>
          <ul>
            ${emailData.supportActions.map(action => `<li>${action}</li>`).join('')}
          </ul>
        `

      case 'orderCancelled':
        return `
          <h2>Order cancellation confirmed</h2>
          <p>Your order #${emailData.orderId} has been cancelled as requested.</p>
          ${emailData.cancellationReason ? `<p><strong>Reason:</strong> ${emailData.cancellationReason}</p>` : ''}
          <p><strong>Refund Amount:</strong> $${emailData.refundAmount}</p>
          <p><strong>Refund Timeline:</strong> ${emailData.refundTimeline}</p>
        `

      case 'reviewReminder':
        return `
          <h2>How was your recent purchase?</h2>
          <p>We'd love to hear about your experience with order #${emailData.orderId}!</p>
          <p>${emailData.reviewIncentive}</p>
          <p><a href="${emailData.reviewUrl}" style="color: #007bff;">Leave a review</a></p>
        `

      default:
        return '<p>Thank you for your order!</p>'
    }
  }

  /**
   * Store email notification for demo purposes
   */
  storeEmailNotification(emailData) {
    try {
      const notifications = JSON.parse(localStorage.getItem('email_notifications') || '[]')
      notifications.unshift({
        id: Date.now(),
        ...emailData,
        timestamp: new Date().toISOString(),
        read: false
      })
      
      // Keep only last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50)
      }
      
      localStorage.setItem('email_notifications', JSON.stringify(notifications))
    } catch (error) {
      console.error('Failed to store email notification:', error)
    }
  }

  /**
   * Get estimated delivery date
   */
  getEstimatedDelivery(order) {
    const processingDays = order.payment_method === 'bank-account' ? 2 : 1
    const shippingDays = 3
    const totalDays = processingDays + shippingDays
    
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + totalDays)
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Get estimated shipping date
   */
  getEstimatedShipping(order) {
    const processingDays = order.payment_method === 'bank-account' ? 2 : 1
    
    const shippingDate = new Date()
    shippingDate.setDate(shippingDate.getDate() + processingDays)
    
    return shippingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Get refund timeline based on payment method
   */
  getRefundTimeline(paymentMethod) {
    const timelines = {
      'card': '3-5 business days',
      'bank-account': '5-7 business days',
      'paypal': '1-3 business days',
      'wire-transfer': '7-10 business days'
    }
    
    return timelines[paymentMethod] || '3-7 business days'
  }

  /**
   * Get stored email notifications
   */
  getStoredNotifications() {
    try {
      return JSON.parse(localStorage.getItem('email_notifications') || '[]')
    } catch (error) {
      console.error('Failed to load email notifications:', error)
      return []
    }
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notificationId) {
    try {
      const notifications = this.getStoredNotifications()
      const notification = notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
        localStorage.setItem('email_notifications', JSON.stringify(notifications))
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications() {
    try {
      localStorage.removeItem('email_notifications')
      showMessage('All email notifications cleared', 'success')
    } catch (error) {
      console.error('Failed to clear notifications:', error)
    }
  }
}

// Create and export singleton instance
export const emailNotificationService = new EmailNotificationService()

// Export individual functions for convenience
export const {
  sendOrderConfirmation,
  sendPaymentConfirmation,
  sendOrderProcessing,
  sendShippingNotification,
  sendDeliveryConfirmation,
  sendCancellationNotification,
  sendReviewReminder
} = emailNotificationService
