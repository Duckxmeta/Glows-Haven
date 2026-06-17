const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve all static files from the root directory
app.use(express.static(__dirname));

// Fallback: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Glow's Haven server running on port ${port}`);
});
