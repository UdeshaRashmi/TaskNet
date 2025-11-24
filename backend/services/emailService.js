const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  // Check if required environment variables are present
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration missing. Using Ethereal fallback for development.');
    
    // For development, we can use Ethereal or similar service
    // In production, you would use your actual email service credentials
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'your-ethereal-email@ethereal.email',
        pass: 'your-ethereal-password'
      }
    });
  }

  // Log email configuration for debugging
  console.log('Email configuration:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    user: process.env.EMAIL_USER
  });

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email notification for task due date
const sendTaskDueNotification = async (user, task) => {
  try {
    console.log('Attempting to send email to:', user.email);
    console.log('Task details:', { title: task.title, id: task._id });
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"TaskNest" <no-reply@tasknest.com>',
      to: user.email,
      subject: `Task Due Today: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Task Due Today Reminder</h2>
          <p>Hello ${user.name},</p>
          <p>This is a reminder that your task "<strong>${task.title}</strong>" is due today.</p>
          
          ${task.description ? `
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Description:</h3>
            <p>${task.description}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Task Details:</h3>
            <ul>
              <li><strong>Status:</strong> ${task.status}</li>
              <li><strong>Priority:</strong> ${task.priority}</li>
              ${task.category ? `<li><strong>Category:</strong> ${task.category.name}</li>` : ''}
            </ul>
          </div>
          
          <p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/tasks/${task._id}" 
               style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Task
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            You're receiving this email because you have email notifications enabled in your TaskNest account.
            If you don't want to receive these emails, you can disable them in your account settings.
          </p>
        </div>
      `
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

module.exports = {
  sendTaskDueNotification
};