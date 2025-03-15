const http = require('http');
const fs = require('fs');
const path = require('path');


const server = http.createServer((req, res) => {
 
  const { url, method } = req;

  
  console.log(`Request received: ${method} ${url}`);


  if (method === 'GET') {
      let filePath;

      
      switch (url) {
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
                
                filePath = path.join(__dirname, 'public', '404.html'); // Serve a 404 page
                res.writeHead(404, { 'Content-Type': 'text/html' });
                break;
          
      }

      
      fs.readFile(filePath, (err, data) => {
          if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
          } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(data);
          }
      });
    }
      else if (method === 'POST' && url === '/project/new') {
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
    }
   else {
     
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
  }
});



const port = 3000;
server.listen(port,() => {
    console.log(`Server running on port ${port}`);
})