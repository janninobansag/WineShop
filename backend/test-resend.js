const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['YOUR_EMAIL@gmail.com'], // Put your real email here
      subject: 'Test Email from WineShop',
      html: '<h1>Test</h1><p>This is a test email from your WineShop app!</p>',
    });
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success! Email sent:', data);
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

testEmail();