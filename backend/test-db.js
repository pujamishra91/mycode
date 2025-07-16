const sql = require('mssql');

const config = {
  user: 'myAppUser',
  password: 'Ashish',
  server: 'DESKTOP-6GGBHD8',
  port: 1433,
  database: 'invoicemanager',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

async function testConnection() {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT TOP 1 * FROM invoices`;
    console.log('✅ DB Connected! Sample result:', result.recordset);
  } catch (err) {
    console.error('❌ DB Connection Failed:', err);
  }
}

testConnection();
