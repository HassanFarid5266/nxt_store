import { showMessage } from './message'

class EmailNotificationService {
  constructor() {
    this.templates = {
      orderConfirmation: 'Order Confirmation - #{orderId}',
      paymentConfirmed: 'Payment Confirmed - Order #{orderId}',
      orderProcessing: 'Your Order is Being Processed - #{orderId}',
      orderShipped: 'Your Order Has Shipped - #{orderId}',
      orderDelivered: 'Order Delivered - #{orderId}',
      orderCancelled: 'Order Cancelled - #{orderId}',
      reviewReminder: 'How was your recent purchase? - #{orderId}'
    }
  }

  async sendOrderConfirmation(order, customerEmail) {
    return this.sendEmail('orderConfirmation', order, customerEmail)
  }

  async sendPaymentConfirmation(order, customerEmail) {
    return this.sendEmail('paymentConfirmed', order, customerEmail)
  }

  async sendOrderProcessing(order, customerEmail) {
    return this.sendEmail('orderProcessing', order, customerEmail)
  }

  async sendShippingNotification(order, customerEmail, trackingNumber) {
    return this.sendEmail('orderShipped', { ...order, tracking_number: trackingNumber }, customerEmail)
  }

  async sendDeliveryConfirmation(order, customerEmail) {
    return this.sendEmail('orderDelivered', order, customerEmail)
  }

  async sendCancellationNotification(order, customerEmail, reason = '') {
    return this.sendEmail('orderCancelled', { ...order, cancellation_reason: reason }, customerEmail)
  }

  async sendReviewReminder(order, customerEmail) {
    setTimeout(() => this.sendEmail('reviewReminder', order, customerEmail), 3 * 24 * 60 * 60 * 1000)
  }

  async sendEmail(type, order, customerEmail) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const subject = this.templates[type].replace('{orderId}', order.id)
      
      console.log('📧 Email Sent:', {
        to: customerEmail,
        subject,
        type,
        orderId: order.id
      })

      showMessage(`Email sent: ${subject}`, 'success')
      this.storeEmailLog(customerEmail, subject, type, order)
      
      return { success: true, messageId: 'msg_' + Date.now() }
    } catch (error) {
      console.error('Email sending failed:', error)
      showMessage('Failed to send email notification', 'error')
      return { success: false, error: error.message }
    }
  }

  storeEmailLog(to, subject, type, order) {
    try {
      const logs = JSON.parse(localStorage.getItem('email_notifications') || '[]')
      logs.unshift({
        id: Date.now(),
        to,
        subject,
        type,
        orderId: order.id,
        timestamp: new Date().toISOString(),
        read: false
      })
      
      if (logs.length > 50) logs.splice(50)
      localStorage.setItem('email_notifications', JSON.stringify(logs))
    } catch (error) {
      console.error('Error storing email log:', error)
    }
  }

  getStoredNotifications() {
    try {
      return JSON.parse(localStorage.getItem('email_notifications') || '[]')
    } catch (error) {
      return []
    }
  }

  clearAllNotifications() {
    localStorage.removeItem('email_notifications')
    showMessage('All email notifications cleared', 'success')
  }
}

export const emailNotificationService = new EmailNotificationService()

export const {
  sendOrderConfirmation,
  sendPaymentConfirmation,
  sendOrderProcessing,
  sendShippingNotification,
  sendDeliveryConfirmation,
  sendCancellationNotification,
  sendReviewReminder
} = emailNotificationService
