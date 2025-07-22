// StatusChart.js
import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatusChart = ({ invoices }) => {
  const statusCounts = {
    Paid: invoices.filter(inv => inv.status === 'Paid').length,
    Unpaid: invoices.filter(inv => inv.status === 'Unpaid').length,
    Overdue: invoices.filter(inv => inv.status === 'Overdue').length
  };

  const data = {
    labels: ['Paid', 'Unpaid', 'Overdue'],
    datasets: [{
      label: 'Invoices Status',
      data: [statusCounts.Paid, statusCounts.Unpaid, statusCounts.Overdue],
      backgroundColor: ['#28a745', '#f39c12', '#dc3545']
    }]
  };

  return (
    <div style={{ display: 'flex', gap: '50px', justifyContent: 'center', marginTop: '30px' }}>
      <div style={{ width: '300px' }}>
        <h4 style={{ textAlign: 'center' }}>Status Pie Chart</h4>
        <Pie data={data} />
      </div>
      <div style={{ width: '400px' }}>
        <h4 style={{ textAlign: 'center' }}>Status Bar Chart</h4>
        <Bar data={data} />
      </div>
    </div>
  );
};

export default StatusChart;
