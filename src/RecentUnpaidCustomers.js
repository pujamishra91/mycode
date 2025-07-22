import React from 'react';

const RecentUnpaidCustomers = ({ invoices }) => {
  const unpaidInvoices = invoices
    .filter(inv => inv.status === 'Unpaid')
    .slice(0, 5); // latest 5 unpaid invoices

  return (
    <div>
      <h3>Recent Unpaid Customers</h3>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Amount</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {unpaidInvoices.map((inv, index) => (
            <tr key={index}>
              <td>{inv.customer}</td>
              <td>{inv.amount}</td>
              <td>{inv.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentUnpaidCustomers;
