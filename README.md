# JULDD's Ultimate Calculator

## Overview
JULDD's Ultimate Calculator is a comprehensive web-based calculator tool that includes various calculators for different purposes, including:
- Core Math (Basic and Scientific calculators)
- Financial calculators
- Practical calculators
- Lifestyle calculators
- Home calculators
- Work calculators
- Business calculators
- Travel calculators
- Education calculators
- Freelance Calculator

## Recent Improvements
### Core Math Section Layout Enhancement
The Core Math section has been improved to center the calculators better on the page. Previously, the Basic Calculator and Scientific Calculator were displayed side by side with a lot of empty space on both sides, making the layout look off-balance. The new CSS changes center the calculators properly, creating a more balanced and professional appearance.

### CSS Changes
The following CSS was added to center the calculators:

```css
/* Center the calculators in Core Math section */
#core-math .tools-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(350px, 400px));
    gap: 20px;
    justify-content: center;
    margin: 0 auto;
    max-width: 900px;
}

/* Responsive adjustments */
@media (max-width: 900px) {
    #core-math .tools-grid {
        grid-template-columns: 1fr;
        max-width: 450px;
    }
}
```

## Deployment Instructions
### Local Development
1. Clone this repository
2. Navigate to the project directory
3. Open index.html in your browser or use a local server:
   ```
   python -m http.server 8000
   ```
4. Access the calculator at http://localhost:8000

### Cloudflare Pages Deployment
This project is configured for deployment to Cloudflare Pages:

1. Install Wrangler CLI (if not already installed):
   ```
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```
   wrangler login
   ```

3. Deploy to Cloudflare Pages:
   ```
   wrangler pages publish .
   ```

## Files and Structure
- `index.html` - Main HTML file containing all calculator interfaces
- `styles.css` - Main stylesheet for the calculator
- `center-fix.css` - Additional CSS to center the Core Math calculators
- `script.js` - Main JavaScript file for calculator functionality
- `wrangler.toml` - Configuration file for Cloudflare deployment
- `package.json` - Project configuration and dependencies

## Browser Compatibility
The calculator is designed to work on modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Responsive Design
The calculator is fully responsive and works well on:
- Desktop computers
- Tablets
- Mobile phones

The responsive design ensures that the calculators stack vertically on smaller screens while maintaining functionality and usability.