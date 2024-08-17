import transporter from '@/config/email';

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Company" <your-email@example.com>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email: %s', error.message);
  }
};
