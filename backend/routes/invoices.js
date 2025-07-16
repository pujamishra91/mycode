const express = require('express');
const router = express.Router();
const { poolConnect, pool, sql } = require('../db');

router.post('/', async (req, res) => {
  await poolConnect;

  const {
    invoiceNumber, client, product, quantity,
    unitPrice, amount, gst, total, date, description,
    number, address, pin, state, email,
    paymentMode, paymentDate, paymentAmount
  } = req.body;

  try {
    console.log('📨 Received invoice data:', req.body); // 🧾 Full payload
    const invoiceResult = await pool.request()
      .input('invoiceNumber', sql.VarChar, invoiceNumber)
      .input('client', sql.VarChar, client)
      .input('product', sql.VarChar, product)
      .input('quantity', sql.Int, quantity)
      .input('unitPrice', sql.Decimal(10, 2), unitPrice)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('gst', sql.Decimal(10, 2), gst)
      .input('total', sql.Decimal(10, 2), total)
      .input('date', sql.Date, date)
      .input('description', sql.Text, description)
      .input('number', sql.VarChar, number)
      .input('address', sql.Text, address)
      .input('pin', sql.VarChar, pin)
      .input('state', sql.VarChar, state)
      .input('email', sql.VarChar, email)
      .query(`
        INSERT INTO invoices 
        (invoice_number, client, product, quantity, unit_price, amount, gst, total, date, description, number, address, pin, state, email) 
        OUTPUT INSERTED.id 
        VALUES (@invoiceNumber, @client, @product, @quantity, @unitPrice, @amount, @gst, @total, @date, @description, @number, @address, @pin, @state, @email)`);

    const invoiceID = invoiceResult.recordset[0].id;
    console.log('✅ Invoice saved with ID:', invoiceID);

    // Insert Payment
    if (paymentMode && paymentDate && paymentAmount) {
      console.log('💰 Inserting Payment:', { paymentMode, paymentDate, paymentAmount, invoiceID });

      await pool.request()
        .input('PaymentMode', sql.VarChar, paymentMode)
        .input('PaymentDate', sql.Date, paymentDate)
        .input('Amount', sql.Decimal(10, 2), paymentAmount)
        .input('InvoiceID', sql.BigInt, invoiceID)
        .query(`INSERT INTO PaymentDetails (PaymentMode, PaymentDate, Amount, InvoiceID)
                VALUES (@PaymentMode, @PaymentDate, @Amount, @InvoiceID)`);

      console.log('✅ Payment inserted');
    } else {
      console.log('⚠️ Payment not inserted – missing fields');
    }

    res.status(201).send('Invoice and payment saved');
  } catch (err) {
    console.error('🔥 Error saving invoice or payment:', err);
    res.status(500).send('Error saving invoice and payment');
  }
});



router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query('SELECT * FROM invoices');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching invoices');
  }
});

module.exports = router;
