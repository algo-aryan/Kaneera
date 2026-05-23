export const getOrderConfirmationEmail = (orderId: string, amount: number, address: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfbf9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-top: 4px solid #d4af37; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 28px; font-weight: bold; color: #2c2c2c; letter-spacing: 2px; }
    .subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #8e8e8e; margin-top: 4px; }
    h1 { color: #2c2c2c; font-size: 24px; font-weight: 300; text-align: center; margin-bottom: 30px; }
    .content { color: #5a5a5a; font-size: 16px; line-height: 1.6; }
    .order-details { background-color: #fcfbf9; padding: 20px; margin: 30px 0; border-left: 2px solid #d4af37; }
    .order-details p { margin: 10px 0; font-size: 14px; }
    .total { font-size: 18px; font-weight: bold; color: #2c2c2c; margin-top: 20px; border-top: 1px solid #eaeaea; padding-top: 20px; }
    .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #a0a0a0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KANEERA</div>
      <div class="subtitle">by Aashi</div>
    </div>
    <h1>Thank You For Your Order</h1>
    <div class="content">
      <p>Your beautiful jewelry is being prepared with care. We have received your order and are getting it ready for shipment.</p>
      
      <div class="order-details">
        <p><strong>Order ID:</strong> #${orderId.slice(0, 8).toUpperCase()}</p>
        <p><strong>Shipping To:</strong><br>${address}</p>
        <div class="total">Total Paid: ₹${amount.toFixed(2)}</div>
      </div>
      
      <p>We will send you another email as soon as your package ships.</p>
      <p>With elegance,<br>The Kaneera Team</p>
      <p style="font-size: 12px; color: #888; margin-top: 30px;"><i>Please do not reply to this email. For any queries, please reach out to our customer support.</i></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Kaneera. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const getOrderShippedEmail = (orderId: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfbf9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-top: 4px solid #d4af37; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 28px; font-weight: bold; color: #2c2c2c; letter-spacing: 2px; }
    .subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #8e8e8e; margin-top: 4px; }
    h1 { color: #2c2c2c; font-size: 24px; font-weight: 300; text-align: center; margin-bottom: 30px; }
    .content { color: #5a5a5a; font-size: 16px; line-height: 1.6; }
    .highlight { color: #d4af37; font-weight: bold; }
    .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #a0a0a0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KANEERA</div>
      <div class="subtitle">by Aashi</div>
    </div>
    <h1>Your Order is on the Way!</h1>
    <div class="content">
      <p>Great news! Your Order <span class="highlight">#${orderId.slice(0, 8).toUpperCase()}</span> has been shipped and is on its way to you.</p>
      <p>Thank you for choosing Kaneera for your premium jewelry needs. We hope you love your new pieces as much as we loved creating them for you.</p>
      <p>With elegance,<br>The Kaneera Team</p>
      <p style="font-size: 12px; color: #888; margin-top: 30px;"><i>Please do not reply to this email. For any queries, please reach out to our customer support.</i></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Kaneera. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
