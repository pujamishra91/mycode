// InvoicePrintPage.js
import React, { useEffect, useState } from 'react';

const InvoicePrintPage = () => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedInvoice');
    if (stored) {
      setInvoice(JSON.parse(stored));
    }
  }, []);

  const formatDateMMDDYYYY = (dateString) => {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const formatRupees = (num) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);

  if (!invoice || !Array.isArray(invoice.items)) {
    return <div>No invoice data available</div>;
  }

  return (
    <div className="invoice-print-container">
      <h3 className="invoice-title">TAX INVOICE</h3>
      <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
      <p><strong>Client:</strong> {invoice.client}</p>
      <p><strong>Date:</strong> {formatDateMMDDYYYY(invoice.date)}</p>
      <hr />

      <table border="1" width="100%" cellPadding="5">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>GST</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.product}</td>
              <td>{item.quantity}</td>
              <td>{formatRupees(item.unitPrice)}</td>
              <td>{formatRupees(item.amount * 0.18)}</td>
              <td>{formatRupees(item.amount + item.amount * 0.18)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={{ textAlign: 'right', marginTop: '20px' }}>
        Total: {formatRupees(invoice.total)}
      </h4>

      <button onClick={() => window.print()}>🖨️ Print</button>
    </div>
  );
};

export default InvoicePrintPage;
