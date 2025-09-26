import { showMessage } from './message'

export class EmailService {
  static emailTemplates = {
    orderConfirmation: {
      subject: 'Order Confirmation - Order #{orderId}',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #007bff; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order with NXT Store</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #343a40; margin-top: 0;">Order Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Order Number:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right;">#{orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Order Date:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right;">{orderDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Total Amount:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right; font-weight: bold; color: #007bff;">$${total}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
                <td style="padding: 8px 0; text-align: right;">{paymentMethod}</td>
              </tr>
            </table>
            
            <h3 style="color: #343a40; margin-bottom: 15px;">Items Ordered</h3>
            {itemsList}
            
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #6c757d;">
                <strong>What's next?</strong><br>
                We're processing your order and will send you tracking information once it ships.
                Estimated delivery: 3-5 business days.
              </p>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; margin-top: 20px;">
              Questions about your order? Contact us at support@nxtstore.com
            </p>
          </div>
        </div>
      `
    },
    
    paymentPending: {
      subject: 'Payment Pending - Order #{orderId}',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ffc107; color: #212529; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Payment Pending</h1>
            <p style="margin: 10px 0 0 0;">Order #{orderId} is awaiting payment</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #343a40; margin-top: 0;">Complete Your Payment</h2>
            <p style="color: #6c757d; line-height: 1.6;">
              Thank you for placing your order! We've received your order details and are waiting for payment confirmation.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">Bank Transfer Instructions</h3>
              <p style="color: #856404; margin: 5px 0;">
                <strong>Account Name:</strong> NXT Store Ltd.<br>
                <strong>Account Number:</strong> 1234567890<br>
                <strong>Routing Number:</strong> 021000021<br>
                <strong>Reference:</strong> Order #{orderId}
              </p>
            </div>
            
            <p style="color: #dc3545; font-weight: bold;">
              Please complete payment within 24 hours to secure your order.
            </p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Order Total:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right; font-weight: bold; color: #007bff;">$${total}</td>
              </tr>
            </table>
          </div>
        </div>
      `
    },
    
    orderProcessing: {
      subject: 'Order Processing - Order #{orderId}',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #007bff; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Order Processing</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your order is being prepared for shipment</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #343a40; margin-top: 0;">Good News!</h2>
            <p style="color: #6c757d; line-height: 1.6;">
              Your payment has been confirmed and your order is now being processed. 
              Our team is carefully picking and packing your items.
            </p>
            
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #0c5460; margin: 0;">
                <strong>Estimated shipping:</strong> 1-2 business days<br>
                <strong>Estimated delivery:</strong> 3-5 business days
              </p>
            </div>
            
            <p style="color: #6c757d;">
              You'll receive another email with tracking information once your order ships.
            </p>
          </div>
        </div>
      `
    },
    
    orderShipped: {
      subject: 'Order Shipped - Order #{orderId}',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Order Shipped! 📦</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your order is on its way</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #343a40; margin-top: 0;">Tracking Information</h2>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #155724; margin: 0;">
                <strong>Tracking Number:</strong> {trackingNumber}<br>
                <strong>Carrier:</strong> FedEx<br>
                <strong>Estimated Delivery:</strong> {estimatedDelivery}
              </p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://www.fedex.com/track?trknbr={trackingNumber}" 
                 style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Track Your Package
              </a>
            </div>
            
            <p style="color: #6c757d; font-size: 14px;">
              Having trouble with the link? Copy and paste this tracking number: {trackingNumber}
            </p>
          </div>
        </div>
      `
    },
    
    orderDelivered: {
      subject: 'Order Delivered - Order #{orderId}',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Order Delivered! 🎉</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your package has arrived</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #343a40; margin-top: 0;">Thank You!</h2>
            <p style="color: #6c757d; line-height: 1.6;">
              Your order has been successfully delivered. We hope you love your purchase!
            </p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #155724; margin: 0;">
                <strong>Delivered on:</strong> {deliveryDate}<br>
                <strong>Order Total:</strong> $${total}
              </p>
            </div>
            
            <h3 style="color: #343a40;">How was your experience?</h3>
            <p style="color: #6c757d;">
              We'd love to hear your feedback! Please take a moment to rate your order and share your experience.
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="#" style="background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
                Rate Your Order
              </a>
              <a href="#" style="background: #6c757d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Order Again
              </a>
            </div>
          </div>
        </div>
      `
    },
    
    orderCancelled: {
      subject: 'Order Cancelled - Order #{orderId}',
      template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Order Cancelled</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Order #{orderId} has been cancelled</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #343a40; margin-top: 0;">Cancellation Confirmed</h2>
            <p style="color: #6c757d; line-height: 1.6;">
              Your order has been successfully cancelled as requested.
            </p>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #721c24; margin: 0;">
                <strong>Refund Information:</strong><br>
                If payment was processed, your refund will be issued within 3-5 business days to your original payment method.
              </p>
            </div>
            
            <p style="color: #6c757d;">
              We're sorry to see you go! If you have any feedback on how we can improve, 
              please don't hesitate to contact our support team.
            </p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="#" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Browse Our Store
              </a>
            </div>
          </div>
        </div>
      `
    }
  }

  static formatPaymentMethod(method) {
    const methods = {
      'card': 'Credit/Debit Card',
      'bank-account': 'Bank Transfer',
      'paypal': 'PayPal',
      'wire-transfer': 'Wire Transfer'
    }
    return methods[method] || method
  }

  static formatItemsList(items) {
    if (!items || items.length === 0) {
      return '<p style="color: #6c757d;">No items found</p>'
    }

    return items.map(item => `
      <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #dee2e6;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #343a40;">${item.product_title || item.title}</strong>
            ${item.variation ? `<br><small style="color: #6c757d;">Variation: ${item.variation}</small>` : ''}
            <br><small style="color: #6c757d;">Quantity: ${item.quantity || 1}</small>
          </div>
          <div style="text-align: right;">
            <strong style="color: #007bff;">$${parseFloat(item.price).toFixed(2)}</strong>
          </div>
        </div>
      </div>
    `).join('')
  }

  static async sendOrderConfirmation(order, items = []) {
    try {
      const template = this.emailTemplates.orderConfirmation
      const emailContent = template.template
        .replace(/{orderId}/g, order.id)
        .replace(/{orderDate}/g, new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }))
        .replace(/\$\{total\}/g, parseFloat(order.total).toFixed(2))
        .replace(/{paymentMethod}/g, this.formatPaymentMethod(order.payment_method))
        .replace(/{itemsList}/g, this.formatItemsList(items))

      const subject = template.subject.replace(/{orderId}/g, order.id)

      // Simulate email sending
      await this.simulateEmailSend(order.email, subject, emailContent)
      
      return { success: true, message: 'Order confirmation email sent' }
    } catch (error) {
      console.error('Error sending order confirmation:', error)
      return { success: false, message: 'Failed to send confirmation email' }
    }
  }

  static async sendPaymentPending(order) {
    try {
      const template = this.emailTemplates.paymentPending
      const emailContent = template.template
        .replace(/{orderId}/g, order.id)
        .replace(/\$\{total\}/g, parseFloat(order.total).toFixed(2))

      const subject = template.subject.replace(/{orderId}/g, order.id)

      await this.simulateEmailSend(order.email, subject, emailContent)
      
      return { success: true, message: 'Payment pending email sent' }
    } catch (error) {
      console.error('Error sending payment pending email:', error)
      return { success: false, message: 'Failed to send payment pending email' }
    }
  }

  static async sendOrderProcessing(order) {
    try {
      const template = this.emailTemplates.orderProcessing
      const emailContent = template.template
        .replace(/{orderId}/g, order.id)

      const subject = template.subject.replace(/{orderId}/g, order.id)

      await this.simulateEmailSend(order.email, subject, emailContent)
      
      return { success: true, message: 'Order processing email sent' }
    } catch (error) {
      console.error('Error sending order processing email:', error)
      return { success: false, message: 'Failed to send processing email' }
    }
  }

  static async sendOrderShipped(order) {
    try {
      const template = this.emailTemplates.orderShipped
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)
      
      const emailContent = template.template
        .replace(/{orderId}/g, order.id)
        .replace(/{trackingNumber}/g, order.tracking_number || 'TRK123456789')
        .replace(/{estimatedDelivery}/g, estimatedDelivery.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }))

      const subject = template.subject.replace(/{orderId}/g, order.id)

      await this.simulateEmailSend(order.email, subject, emailContent)
      
      return { success: true, message: 'Shipping confirmation email sent' }
    } catch (error) {
      console.error('Error sending shipping email:', error)
      return { success: false, message: 'Failed to send shipping email' }
    }
  }

  static async sendOrderDelivered(order) {
    try {
      const template = this.emailTemplates.orderDelivered
      const emailContent = template.template
        .replace(/{orderId}/g, order.id)
        .replace(/{deliveryDate}/g, new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }))
        .replace(/\$\{total\}/g, parseFloat(order.total).toFixed(2))

      const subject = template.subject.replace(/{orderId}/g, order.id)

      await this.simulateEmailSend(order.email, subject, emailContent)
      
      return { success: true, message: 'Delivery confirmation email sent' }
    } catch (error) {
      console.error('Error sending delivery email:', error)
      return { success: false, message: 'Failed to send delivery email' }
    }
  }

  static async sendOrderCancelled(order) {
    try {
      const template = this.emailTemplates.orderCancelled
      const emailContent = template.template
        .replace(/{orderId}/g, order.id)

      const subject = template.subject.replace(/{orderId}/g, order.id)

      await this.simulateEmailSend(order.email, subject, emailContent)
      
      return { success: true, message: 'Cancellation email sent' }
    } catch (error) {
      console.error('Error sending cancellation email:', error)
      return { success: false, message: 'Failed to send cancellation email' }
    }
  }

  static async simulateEmailSend(to, subject, content) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    // Log email details (in a real app, this would send to an email service)
    console.log('📧 Email Sent:', {
      to,
      subject,
      timestamp: new Date().toISOString(),
      contentLength: content.length
    })

    // Show notification to user
    showMessage(`Email sent: ${subject}`, 'success')
    
    // Store in localStorage for demo purposes
    this.storeEmailLog(to, subject, content)
  }

  static storeEmailLog(to, subject, content) {
    try {
      const logs = JSON.parse(localStorage.getItem('email_logs') || '[]')
      logs.unshift({
        id: Date.now(),
        to,
        subject,
        content,
        timestamp: new Date().toISOString(),
        read: false
      })
      
      // Keep only last 50 emails
      if (logs.length > 50) {
        logs.splice(50)
      }
      
      localStorage.setItem('email_logs', JSON.stringify(logs))
    } catch (error) {
      console.error('Error storing email log:', error)
    }
  }

  static getEmailLogs() {
    try {
      return JSON.parse(localStorage.getItem('email_logs') || '[]')
    } catch (error) {
      console.error('Error getting email logs:', error)
      return []
    }
  }

  static clearEmailLogs() {
    localStorage.removeItem('email_logs')
  }

  static previewEmail(templateType, order, items = []) {
    try {
      const template = this.emailTemplates[templateType]
      if (!template) {
        throw new Error('Template not found')
      }

      let emailContent = template.template
        .replace(/{orderId}/g, order.id || 'ORD-PREVIEW')
        .replace(/{orderDate}/g, new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }))
        .replace(/\$\{total\}/g, parseFloat(order.total || 99.99).toFixed(2))
        .replace(/{paymentMethod}/g, this.formatPaymentMethod(order.payment_method || 'card'))
        .replace(/{itemsList}/g, this.formatItemsList(items))
        .replace(/{trackingNumber}/g, order.tracking_number || 'TRK123456789')
        .replace(/{estimatedDelivery}/g, new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }))
        .replace(/{deliveryDate}/g, new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }))

      const subject = template.subject.replace(/{orderId}/g, order.id || 'ORD-PREVIEW')

      return { subject, content: emailContent }
    } catch (error) {
      console.error('Error previewing email:', error)
      throw error
    }
  }
}

export default EmailService
