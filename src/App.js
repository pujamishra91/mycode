import React, { useEffect, useState } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './InvoicePrint.css'; // create this new CSS file
//import jsPDF from 'jspdf';
import { HashRouter as Router } from "react-router-dom";
const formatDateMMDDYYYY = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};


function App() {
  const [client, setClient] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [invoiceCount, setInvoiceCount] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPrintForm, setShowPrintForm] = useState(false);
  const GST_RATE = 0.18;
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [payments, setPayments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  const doc = new jsPDF();
  const [items, setItems] = useState([
    { product: '', quantity: '', unitPrice: '', description: '' }
  ]);





  useEffect(() => {
    // Fetch invoices
    fetch('https://mybackend-gm4k.onrender.com/api/invoices')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(inv => ({
          id: inv.id,
          invoiceNumber: inv.invoice_number,
          client: inv.client,
          product: inv.product,
          quantity: inv.quantity,
          unitPrice: inv.unit_price,
          amount: inv.amount,
          gst: inv.gst,
          total: inv.total,
          date: inv.date,
          description: inv.description
        }));
        setInvoices(formatted);
        setInvoiceCount(data.length + 1);
      })
      .catch(err => console.error('Error loading invoices:', err));

    // Fetch payment details
    fetch('https://mybackend-gm4k.onrender.com/api/invoices')
      .then(res => res.json())
      .then(data => setPayments(data))
      .catch(err => console.error('Error loading payment details:', err));
  }, []);

  const handlePrintClick = (invoice) => {
  // Ensure it's saved before opening the new tab
  localStorage.setItem('selectedInvoice', JSON.stringify(invoice));

  // Delay slightly to give localStorage time to sync before new tab reads it
  setTimeout(() => {
    window.open('/print', '_blank');
  }, 100); // small delay
};



  const handleAddInvoice = async (e) => {
    e.preventDefault();
    if (!client || !product || !quantity || !unitPrice || !date) return;

    const itemDetails = items.map((item) => {
      const qty = parseInt(item.quantity);
      const price = parseFloat(item.unitPrice);
      const amount = qty * price;
      return { ...item, amount };
    });

    const subTotal = itemDetails.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = subTotal * GST_RATE;
    const totalWithGST = subTotal + gstAmount;

    const invoiceNumber = `INV-${invoiceCount.toString().padStart(4, '0')}`;

    const newInvoice = {
      invoiceNumber,
      client,
      items: itemDetails,
      amount: subTotal,
      gst: gstAmount,
      total: totalWithGST,
      date,
      number,
      address,
      pin,
      state,
      email,
      paymentMode,
      paymentDate,
      paymentAmount
    };
    try {
      const res = await fetch('https://mybackend-gm4k.onrender.com/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });

      if (res.ok) {
        setInvoices([...invoices, { id: Date.now(), ...newInvoice }]);
        setInvoiceCount(invoiceCount + 1);
        setClient('');
        setProduct('');
        setQuantity('');
        setUnitPrice('');
        setDate('');
        setDescription('');
        setNumber('');
        setAddress('');
        setPin('');
        setState('');
        setEmail('');
      } else {
        console.error('Failed to add invoice');
      }
    } catch (err) {
      console.error('Error posting invoice:', err);
    }
  };

  const formatRupees = (num) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(num);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Invoice Report', 14, 15);
    doc.autoTable({
      startY: 20,
      head: [['Invoice #', 'Client', 'Product', 'Qty', 'Unit Price', 'Amount', 'GST', 'Total', 'Date', 'Description']],
      body: invoices.map(inv => [
        inv.invoiceNumber,
        inv.client,
        inv.product,
        inv.quantity,
        formatRupees(inv.unitPrice),
        formatRupees(inv.amount),
        formatRupees(inv.gst),
        formatRupees(inv.total),
        inv.date,
        inv.description
      ])
    });
    doc.save('invoices.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(invoices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    XLSX.writeFile(workbook, 'invoices.xlsx');
  };

  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    const formatRupees = (num) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);

    const formatDateMMDDYYYY = (dateString) => {
      const date = new Date(dateString);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    };

    doc.setFontSize(16);
    doc.text('TAX INVOICE', 80, 15);

    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 14, 30);
    doc.text(`Date: ${formatDateMMDDYYYY(invoice.date)}`, 14, 37);

    doc.text(`Customer Name: ${invoice.client}`, 14, 45);
    doc.text(`Address: ${invoice.customerAddress || invoice.address || '-'}`, 14, 52);
    doc.text(`PIN: ${invoice.customerPin || invoice.pin || '-'}`, 14, 59);
    doc.text(`State: ${invoice.customerState || invoice.state || '-'}`, 14, 66);
    doc.text(`Phone: ${invoice.customerNumber || invoice.number || '-'}`, 14, 73);
    doc.text(`Email: ${invoice.customerEmail || invoice.email || '-'}`, 14, 80);

    doc.autoTable({
      startY: 90,
      head: [['#', 'Item Name', 'Qty', 'Unit Price', 'GST', 'Total']],
      body: invoice.items.map((item, index) => [
        index + 1,
        item.product,
        item.quantity,
        formatRupees(item.unitPrice),
        formatRupees(item.amount * 0.18),
        formatRupees(item.amount + item.amount * 0.18)
      ])
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.text(`Sub Total: ${formatRupees(invoice.amount)}`, 150, finalY);
    doc.text(`SGST (9%): ${formatRupees(invoice.gst / 2)}`, 150, finalY + 7);
    doc.text(`CGST (9%): ${formatRupees(invoice.gst / 2)}`, 150, finalY + 14);
    doc.text(`Total: ${formatRupees(invoice.total)}`, 150, finalY + 21);

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };


  const handleRowClick = (invoice) => {
    localStorage.setItem('selectedInvoice', JSON.stringify(invoice));
    window.open('/print', '_blank');
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
    if(field=="product")
    {
    setProduct(updated);
    }
    if(field=="quantity")
    {
    setQuantity(updated);
    }
    if(field=="unitPrice")
    {
    setUnitPrice(updated);
    }
  };

  const addItem = () => {
    setItems([...items, { product: '', quantity: '', unitPrice: '', description: '' }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };


  const renderPrintForm = () => {
    if (!selectedInvoice) return null;
    return (
      <div className="print-form" style={{
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        marginBottom: '20px'
      }}>
        <h2 style={{ textAlign: 'center' }}>PRODUCT INVOICE</h2>
        <p><strong>Invoice Number:</strong> {selectedInvoice.invoiceNumber}</p>
        <p><strong>Client:</strong> {selectedInvoice.client}</p>
        <p><strong>Product:</strong> {selectedInvoice.product}</p>
        <p><strong>Quantity:</strong> {selectedInvoice.quantity}</p>
        <p><strong>Unit Price:</strong> {formatRupees(selectedInvoice.unitPrice)}</p>
        <p><strong>Amount:</strong> {formatRupees(selectedInvoice.amount)}</p>
        <p><strong>GST (18%):</strong> {formatRupees(selectedInvoice.gst)}</p>
        <p><strong>Total:</strong> {formatRupees(selectedInvoice.total)}</p>
        <p><strong>Date:</strong> {formatDateMMDDYYYY(selectedInvoice.date)}</p>
        <p><strong>Description:</strong> {selectedInvoice.description}</p>
        <button onClick={() => window.print()}>🖨️ Print Invoice</button>
        <button onClick={() => setShowPrintForm(false)} style={{ marginLeft: '10px' }}>Close</button>
      </div>
    );
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.client.toLowerCase().includes(search.toLowerCase())
  );

  const PrintInvoiceView = ({ invoice }) => {
    if (!invoice) return null;

    const formatRupees = (num) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(num);

    const sgst = invoice.gst / 2;
    const cgst = invoice.gst / 2;

    return (
      <div className="invoice-print-container">

        <h3 className="invoice-title">TAX INVOICE</h3>

        <div className="invoice-meta">
          <div className="bill-to">
            <strong>Bill To</strong>
            <p><strong>Name:</strong>{invoice.client}</p>
            <p><strong>Phone:</strong> {invoice.customerNumber}</p>
            <p><strong>Address:</strong> {invoice.customerAddress}</p>
            <p><strong>PIN:</strong> {invoice.customerPin}</p>
            <p><strong>State:</strong> {invoice.customerState}</p>
            <p><strong>Email:</strong> {invoice.customerEmail}</p>
          </div>
          <div className="invoice-details">
            <strong>Invoice Details</strong>
            <p>Invoice No: <a href="#">{invoice.invoiceNumber}</a></p>
            <p>Date: {formatDateMMDDYYYY(invoice.date)}</p>
          </div>
        </div>

        <table className="invoice-items">
          <thead>
            <tr>
              <th>#</th>
              <th>Item name</th>
              <th>Qty</th>
              <th>Price/Unit</th>
              <th>GST</th>
              <th>Amt</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(invoice.items) && invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.product}</td>
                <td>{item.quantity}</td>
                <td>{formatRupees(item.unitPrice)}</td>
                <td>{formatRupees(item.amount * 0.18)} (18%)</td>
                <td>{formatRupees(item.amount + item.amount * 0.18)}</td>
              </tr>
            ))}

          </tbody>

        </table>

        <div className="invoice-summary">
          <div className="in-words">
            <strong>Amount In Words -</strong>
            <p>{convertNumberToWords(invoice.total)} only</p>
          </div>
          <div className="totals">
            <p><strong>Sub Total</strong> <span>{formatRupees(invoice.amount)}</span></p>
            <p>SGST@9% <span>{formatRupees(invoice.gst / 2)}</span></p>
            <p>CGST@9% <span>{formatRupees(invoice.gst / 2)}</span></p>
            <p><strong>Total</strong> <span>{formatRupees(invoice.total)}</span></p>

            <p><strong>Balance Due</strong> <span>{formatRupees(invoice.total)}</span></p>
          </div>
        </div>
        <h2 style={{ marginTop: '40px', fontSize: '18px' }}>Payment Details</h2>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Payment Mode</th>
              <th>Payment Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan="4">No payment records found</td></tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={payment.PaymentID}>
                  <td>{index + 1}</td>
                  <td>{payment.PaymentMode}</td>
                  <td>{formatDateMMDDYYYY(payment.PaymentDate)}</td>
                  <td>{formatRupees(payment.Amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>



        <div className="invoice-buttons">
          <button onClick={() => window.print()}>🖨️ Print</button>
          <button onClick={() => generateInvoicePDF(invoice)}>📄 Download PDF</button>
          <button onClick={() => setShowPrintForm(false)}>Close</button>
        </div>

      </div>
    );
  };

  // Helper to convert number to words (simple)
  const convertNumberToWords = (num) => {
    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
    return formatter.format(num).replace(/[^a-zA-Z\s]/g, '');
  };


  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Invoice Manager</h2>
          <button
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add Invoice
          </button>
          <button
            className={activeTab === 'details' ? 'active' : ''}
            onClick={() => setActiveTab('details')}
          >
            📄 Invoice Details
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {activeTab === 'add' && (
            <div>
              {/* <h3>Add New Invoice</h3> */}
              {/* Your full form here */}
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              {/* <h3>Invoice Details</h3> */}
              {/* Your table, search and export buttons here */}
            </div>
          )}
        </div>
      </div>

      {/* <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Invoice Manager</h1> */}

      {showPrintForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PrintInvoiceView invoice={selectedInvoice} onClose={() => setShowPrintForm(false)} />
          </div>
        </div>
      )}

      {activeTab === 'add' && (

        <div className="invoice-form-container">
          <h2>Add New Invoice</h2>
          <form onSubmit={handleAddInvoice}>
            <div className="invoice-form-group">
              <input
                type="text"
                placeholder="Customer Name"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </div>
            <div className="invoice-form-group">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="invoice-form-group">
              <input
                type="text"
                placeholder="Phone Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="invoice-form-group">
              <input
                type="text"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="invoice-form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <h2 style={{ fontSize: '18px' }}>Add Product Details</h2>
            {items.map((item, index) => (
              <div key={index}>
                <div className="invoice-form-group">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={item.product}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                   // onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </div>

                <div className="invoice-form-group">
                  <input
                    type="number"
                    placeholder="Unit Price (INR)"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </div>

                <button type="button" onClick={() => removeItem(index)}>❌ Remove Item</button>
              </div>
            ))}

            <div className="invoice-form-group">
              <button type="button" onClick={addItem}>➕ Add Item</button>
            </div>


            <h2 style={{ fontSize: '18px' }}>Add Payment Details</h2>
            <div className="invoice-form-group">
              <input
                type="text"
                placeholder="Payment Mode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
              <input
                type="number"
                placeholder="Payment Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>

            <div className="invoice-form-button">
              <button type="submit">Add Invoice</button>
            </div>
          </form>
        </div>

      )}

      {activeTab === 'details' && (
        <div style={{ marginLeft: '20px' }}>
          <div style={{ display: 'flex', marginTop: '106px' }}>
            <div style={{ float: 'left' }}>
              <div className="search-bar" style={{ display: 'flex', gap: '10px', marginBottom: '7px' }}>
                <input
                  type="text"
                  placeholder="Search by Client Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={exportPDF}>Export PDF</button>
                <button onClick={exportExcel}>Export Excel</button>
              </div>
            </div>

            {/* <div style={{ textAlign: 'right', marginBottom: '20px', float:'right'}}>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {showAddForm ? 'Close Invoice Form' : '➕ Add New Invoice'}
      </button>
    </div> */}
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
                <th>GST (18%)</th>
                <th>Total</th>
                <th>Date</th>
                <th>Description</th>

              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, index) => (
                <tr
                  key={invoice.id}
                  onClick={() => handleRowClick(invoice)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.client}</td>
                  <td>{invoice.product}</td>
                  <td>{invoice.quantity}</td>
                  <td>{formatRupees(invoice.unitPrice)}</td>
                  <td>{formatRupees(invoice.amount)}</td>
                  <td>{formatRupees(invoice.gst)}</td>
                  <td>{formatRupees(invoice.total)}</td>
                  <td>{formatDateMMDDYYYY(invoice.date)}</td>
                  <td>{invoice.description}</td>
                </tr>
              ))}
            </tbody>


          </table>
        </div>
      )}

    </div>
  );
}

export default App;
