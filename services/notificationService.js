const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    // Email transporter setup
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Create a notification
  async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      
      // Send notification based on user preferences
      await this.sendNotification(notification);
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send notification through various channels
  async sendNotification(notification) {
    try {
      const user = await User.findById(notification.recipient);
      if (!user) return;

      // Send email if enabled
      if (notification.deliveryChannel.email && user.preferences.notifications.email) {
        await this.sendEmailNotification(notification, user);
      }

      // Send push notification if enabled
      if (notification.deliveryChannel.push && user.preferences.notifications.push) {
        await this.sendPushNotification(notification, user);
      }

      // Send SMS if enabled
      if (notification.deliveryChannel.sms && user.preferences.notifications.sms) {
        await this.sendSMSNotification(notification, user);
      }

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Send email notification
  async sendEmailNotification(notification, user) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: notification.title,
        html: this.generateEmailTemplate(notification, user)
      };

      await this.emailTransporter.sendMail(mailOptions);
      
      // Update delivery status
      await Notification.findByIdAndUpdate(notification._id, {
        'deliveryStatus.email.sent': true,
        'deliveryStatus.email.sentAt': new Date()
      });

    } catch (error) {
      console.error('Email notification error:', error);
      await Notification.findByIdAndUpdate(notification._id, {
        'deliveryStatus.email.error': error.message
      });
    }
  }

  // Send push notification (placeholder - integrate with Firebase/OneSignal)
  async sendPushNotification(notification, user) {
    try {
      // Placeholder for push notification implementation
      // You would integrate with Firebase Cloud Messaging or OneSignal here
      console.log(`Push notification sent to ${user.email}: ${notification.title}`);
      
      // Update delivery status
      await Notification.findByIdAndUpdate(notification._id, {
        'deliveryStatus.push.sent': true,
        'deliveryStatus.push.sentAt': new Date()
      });

    } catch (error) {
      console.error('Push notification error:', error);
      await Notification.findByIdAndUpdate(notification._id, {
        'deliveryStatus.push.error': error.message
      });
    }
  }

  // Send SMS notification (placeholder - integrate with Twilio/similar)
  async sendSMSNotification(notification, user) {
    try {
      // Placeholder for SMS implementation
      // You would integrate with Twilio or similar service here
      console.log(`SMS sent to ${user.phone}: ${notification.message}`);
      
      // Update delivery status
      await Notification.findByIdAndUpdate(notification._id, {
        'deliveryStatus.sms.sent': true,
        'deliveryStatus.sms.sentAt': new Date()
      });

    } catch (error) {
      console.error('SMS notification error:', error);
      await Notification.findByIdAndUpdate(notification._id, {
        'deliveryStatus.sms.error': error.message
      });
    }
  }

  // Generate email template
  generateEmailTemplate(notification, user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${notification.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Carpool App</h1>
          </div>
          <div class="content">
            <h2>${notification.title}</h2>
            <p>Hi ${user.firstName},</p>
            <p>${notification.message}</p>
            ${notification.data.actionUrl ? `<p><a href="${notification.data.actionUrl}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Take Action</a></p>` : ''}
          </div>
          <div class="footer">
            <p>Best regards,<br>Carpool Team</p>
            <p><small>This is an automated message. Please do not reply to this email.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Bulk notification for announcements
  async sendBulkNotification(userIds, notificationData) {
    try {
      const notifications = userIds.map(userId => ({
        ...notificationData,
        recipient: userId
      }));

      await Notification.insertMany(notifications);

      // Send notifications asynchronously
      for (const notification of notifications) {
        this.sendNotification(notification).catch(console.error);
      }

      return { success: true, count: notifications.length };
    } catch (error) {
      console.error('Bulk notification error:', error);
      throw error;
    }
  }

  // Notification templates
  static getNotificationTemplate(type, data) {
    const templates = {
      ride_booked: {
        title: 'New Ride Booking',
        message: `Your ride to ${data.destination} has been booked by ${data.passengerName}.`,
        priority: 'high'
      },
      ride_cancelled: {
        title: 'Ride Cancelled',
        message: `The ride to ${data.destination} scheduled for ${data.departureTime} has been cancelled.`,
        priority: 'high'
      },
      ride_confirmed: {
        title: 'Ride Confirmed',
        message: `Your booking for the ride to ${data.destination} has been confirmed.`,
        priority: 'medium'
      },
      ride_started: {
        title: 'Ride Started',
        message: `Your ride to ${data.destination} has started. The driver is on the way.`,
        priority: 'high'
      },
      ride_completed: {
        title: 'Ride Completed',
        message: `Your ride to ${data.destination} has been completed. Please rate your experience.`,
        priority: 'medium'
      },
      payment_received: {
        title: 'Payment Received',
        message: `Payment of ₦${data.amount} has been received for your ride.`,
        priority: 'medium'
      },
      driver_verified: {
        title: 'Driver Account Verified',
        message: 'Congratulations! Your driver account has been verified. You can now start offering rides.',
        priority: 'high'
      },
      rating_received: {
        title: 'New Rating Received',
        message: `You received a ${data.rating}-star rating from a recent ride.`,
        priority: 'low'
      },
      ride_reminder: {
        title: 'Ride Reminder',
        message: `Reminder: Your ride to ${data.destination} is scheduled in ${data.timeRemaining}.`,
        priority: 'medium'
      }
    };

    return templates[type] || {
      title: 'Notification',
      message: 'You have a new notification.',
      priority: 'medium'
    };
  }
}

module.exports = new NotificationService();
