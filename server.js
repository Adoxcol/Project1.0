const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const { url, method } = req;

    
    const parsedUrl = new URL(url, `http://localhost:3000`);
    const pathname = parsedUrl.pathname; 

    console.log(`Request received: ${method} ${pathname}`);

    if (method === 'GET') {
        let filePath;

        switch (pathname) {
            case '/':
                filePath = path.join(__dirname, 'public', 'file1.html');
                break;
            case '/route1':
                filePath = path.join(__dirname, 'public', 'file2.html');
                break;
            case '/route2':
                filePath = path.join(__dirname, 'public', 'file3.html');
                break;
            default:
             
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return; 
        }

        console.log(`Attempting to serve file: ${filePath}`);

        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (method === 'POST' && pathname === '/project/new') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const parsedBody = new URLSearchParams(body);
            const title = parsedBody.get('title');
            const description = parsedBody.get('description');

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>New Project Added</h1>
                <p>Title: ${title}</p>
                <p>Description: ${description}</p>
            `);
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});