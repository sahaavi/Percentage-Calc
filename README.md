# Percentage Calculator

A fast, static percentage calculator designed for GitHub Pages. The app helps users solve common percentage tasks and includes SEO-friendly content, formulas, a privacy page, sitemap, and crawler support files.

Live URL: https://sahaavi.github.io/Percentage-Calc/

## Calculators

1. Calculate what is X% of Y
2. Calculate what percent X is of Y
3. Calculate percentage increase or decrease between two values
4. Add or subtract a percentage from a value
5. Calculate discount sale price and savings

## Features

- Responsive static UI
- Copy and share actions for results and formulas
- Recent calculations stored locally in the browser
- Quick task presets for discount, tip, tax, raise, markup, and percent change
- SEO metadata, structured data, `robots.txt`, and `sitemap.xml`
- Privacy policy prepared for local storage, Google Analytics, and AdSense disclosures

## How to Use

1. Open `index.html` in your browser
2. Choose the type of calculation you want to perform
3. Enter the required values in the input fields
4. Click "Calculate" to see the result
5. Copy or share the result if needed

## Google Analytics and AdSense

The public Google Analytics measurement ID and AdSense publisher ID are not secrets. To enable them, edit `site-config.js`:

```js
window.PERCENTAGE_CALC_CONFIG = {
    googleAnalyticsId: "G-XXXXXXXXXX",
    adsenseClientId: "ca-pub-XXXXXXXXXXXXXXXX"
};
```

Do not commit private API keys, service account credentials, or anything that gives account access.

For AdSense, add the exact `ads.txt` line from your AdSense account at the root of the deployed domain when Google asks for it. On a GitHub Pages project site, confirm that AdSense expects the file at the right domain root.

## Hosting on GitHub Pages

To host this calculator on GitHub Pages:

1. Create a new repository on GitHub
2. Push these files to your repository
3. Go to your repository settings
4. Scroll down to the "GitHub Pages" section
5. Select the branch you want to deploy (usually `main` or `master`)
6. Your calculator will be available at `https://[your-username].github.io/[repository-name]`

## Local Development

To run this project locally:

1. Clone the repository
2. Open `index.html` in your web browser
3. Make changes to the files as needed
4. Test your changes locally
5. Commit and push your changes to GitHub

## Files

- `index.html` - The main HTML file containing the calculator interface
- `site-config.js` - Public analytics and AdSense IDs
- `tracking.js` - Loads Google Analytics and AdSense only when IDs are configured
- `styles.css` - CSS styles for the calculator
- `script.js` - JavaScript code for the calculations
- `privacy.html` - Privacy policy
- `robots.txt` - Crawler instructions and sitemap pointer
- `sitemap.xml` - Sitemap for search engines
- `404.html` - GitHub Pages not-found page

## License

This project is open source and available under the MIT License. 
