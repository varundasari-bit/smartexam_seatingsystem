#!/usr/bin/env node

/**
 * Smart Exam Seating System - Server
 * 
 * A simple HTTP server for serving the exam seating application.
 * Works on Windows, macOS, and Linux.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// Security headers
const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse URL and sanitize path
    let urlPath = req.url.split('?')[0]; // Remove query strings
    
    // Default to index.html for root path
    if (urlPath === '/' || urlPath === '') {
        urlPath = '/index.html';
    }
    
    // Prevent directory traversal attacks
    urlPath = urlPath.replace(/\.\./g, '');
    
    // Construct full file path
    const filePath = path.join(__dirname, urlPath);
    
    // Get file extension
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read and serve file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 
                    'Content-Type': 'text/html; charset=utf-8',
                    ...securityHeaders
                });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>404 Not Found</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1>404 - Page Not Found</h1>
                        <p>The requested file <code>${req.url}</code> was not found.</p>
                        <p><a href="/">Go back to home</a></p>
                    </body>
                    </html>
                `, 'utf-8');
            } else {
                // Server error
                console.error(`Server error: ${err.code}`);
                res.writeHead(500, { 
                    'Content-Type': 'text/html; charset=utf-8',
                    ...securityHeaders
                });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head><title>500 Server Error</title></head>
                    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                        <h1>500 - Server Error</h1>
                        <p>Something went wrong. Error code: ${err.code}</p>
                    </body>
                    </html>
                `, 'utf-8');
            }
        } else {
            // Success - serve file
            res.writeHead(200, { 
                'Content-Type': contentType,
                ...securityHeaders
            });
            res.end(content);
        }
    });
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`
========================================
ERROR: Port ${PORT} is already in use.
----------------------------------------
Please try one of the following:
1. Stop any other server running on port ${PORT}
2. Use a different port: PORT=8080 node server.js
3. Kill the process using port ${PORT}
========================================
        `);
        process.exit(1);
    } else if (err.code === 'EACCES') {
        console.error(`
========================================
ERROR: Permission denied for port ${PORT}.
----------------------------------------
On Linux/macOS, ports below 1024 require admin privileges.
Try using a higher port: PORT=8080 node server.js
========================================
        `);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Start server
server.listen(PORT, HOST, () => {
    console.log(`
========================================
  Smart Exam Seating System
========================================
Server is running!

Local:   http://localhost:${PORT}/
Network: http://${getNetworkAddress()}:${PORT}/

Press Ctrl+C to stop the server
========================================
    `);
});

// Helper function to get network address
function getNetworkAddress() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0';
}
