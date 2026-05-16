const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
/* ==========================================================================
   MOBILE INTERACTIVE HAMBURGER NAV LOGIC
   ========================================================================== */
function toggleMobileMenu() {
    // Only trigger modal toggle code engines if screen real estate is inside mobile ranges
    if (window.innerWidth <= 991) {
        const menu = document.getElementById('navigationMenu');
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        
        menu.classList.toggle('mobile-menu-active');
        toggleBtn.classList.toggle('open-active');
        
        // Lock body window scroll underneath the popup layout layer to maximize usability
        if (menu.classList.contains('mobile-menu-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}
