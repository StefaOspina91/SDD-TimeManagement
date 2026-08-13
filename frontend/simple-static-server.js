const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;
// serve files from the src folder so URLs are top-level (e.g. /login.html)
const root = path.join(process.cwd(), 'src');
const serve = (req,res) => {
  let p = path.join(root, req.url === '/' ? 'index.html' : req.url);
  fs.stat(p, (err, st) => {
    if (err) { res.statusCode=404; res.end('Not found'); return }
    if (st.isDirectory()) p = path.join(p, 'index.html');
    fs.createReadStream(p).pipe(res);
  });
};
http.createServer(serve).listen(port, ()=> console.log('static server', port));
