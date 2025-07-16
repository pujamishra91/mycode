const express = require('express');
const cors = require('cors');
const invoicesRoute = require('./routes/invoices');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/invoices', invoicesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
