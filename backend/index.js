const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SQL Server config
const config = {
  user: 'myAppUser',
  password: 'Ashish',
  server: 'DESKTOP-6GGBHD8',
  port: 1433, // <-- add this line
  database: 'invoicemanager',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};


// Route to fetch invoices
app.get('/api/invoices', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM invoices`;
    res.json(result.recordset);
  } catch (err) {
    console.error('🔥 SQL Connection Error:', err); // <-- this will show full error
    res.status(500).send(err.message); // also returns message to frontend
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM PaymentDetails');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).send('Server error');
  }
});


// Route to add new invoice
// Route to add new invoice
app.post('/api/invoices', async (req, res) => {
  try {
    const {
      invoiceNumber,
      client,
      product,
      quantity,
      unitPrice,
      amount,
      gst,
      total,
      date,
      description,
      paymentMode,
      paymentDate,
      paymentAmount
    } = req.body;

    console.log('📦 Received invoice + payment:', req.body); // Debug

    await sql.connect(config);

    // 1. Insert invoice and get inserted ID
    const result = await sql.query`
      INSERT INTO invoices (
        invoice_number, client, product, quantity,
        unit_price, amount, gst, total, date, description
      )
      OUTPUT INSERTED.id
      VALUES (
        ${invoiceNumber}, ${client}, ${product}, ${quantity},
        ${unitPrice}, ${amount}, ${gst}, ${total}, ${date}, ${description}
      )
    `;

    const invoiceId = result.recordset[0].id;

    // 2. Insert payment details if provided
    if (paymentMode && paymentDate && paymentAmount) {
      await sql.query`
        INSERT INTO PaymentDetails (
          PaymentMode, PaymentDate, Amount, InvoiceID
        )
        VALUES (
          ${paymentMode}, ${paymentDate}, ${paymentAmount}, ${invoiceId}
        )
      `;
    }

    res.status(201).send('✅ Invoice and payment saved');
  } catch (err) {
    console.error('🔥 Insert Error:', err);
    res.status(500).send(err.message);
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
