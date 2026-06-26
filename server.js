/**
 * DecodeLabs Project 4 Defensive Core Backend Validation Server
 * Standard Node.js execution environment using Express
 */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Apply system interceptor middleware rules
app.use(cors());
app.use(express.json());

// Main Validation Router API endpoint
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    // Backend Deep Inspection Gatekeeper Logic Layer
    if (!name || name.trim().length < 3) {
        return res.status(400).json({ error: 'Server Integrity Defect: Invalid parameter mapping for Name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Server Integrity Defect: Invalid parameter pattern match for Email.' });
    }

    if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Server Integrity Defect: Security length parameter validation constraint missing.' });
    }

    // If payload satisfies all server integrity constraints
    return res.status(200).json({
        message: 'Data Payload verified and committed successfully.',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` DECODELABS TRAINING SERVER ACTIVE ON PROTOCOL PORT http://localhost:${PORT} `);
    console.log(` Processing full-stack application validation interactions...  `);
    console.log(`================================================================`);
});
