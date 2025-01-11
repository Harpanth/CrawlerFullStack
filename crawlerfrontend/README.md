# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



Overview
The Product Search Scraper is a full-stack application that allows users to search for products on popular e-commerce websites, specifically Amazon and eBay, and retrieve relevant product links. The front-end is built with React.js, and the back-end is powered by Node.js and Express. To handle the web scraping, the backend uses Puppeteer, a headless browser automation tool, to simulate user interactions and extract product URLs from the search results of these sites. Additionally, Puppeteer’s Stealth Plugin is employed to avoid detection by websites' anti-bot mechanisms.

This tool is useful for anyone who wants to quickly search across multiple platforms for product listings and aggregate the results. The application is designed to be simple and efficient, providing product URLs from trusted sources based on a search query.

How It Works
Front-End (React.js):

The user interacts with a clean and responsive interface, where they enter a product name in an input field.
Upon submitting the search, the front-end sends a POST request to the back-end server with the product query.
The interface dynamically updates with loading indicators while waiting for results, and displays links to the found products once the data is received from the server.
Back-End (Node.js & Express):

The back-end consists of an Express.js server that handles API requests and runs the web scraping logic.
When a product search is received, the server uses Puppeteer to visit Amazon and eBay search result pages and scrape the product URLs.
The data is returned in a structured format to the front-end, where the URLs are displayed as clickable links.
Web Scraping with Puppeteer:

Puppeteer is used to programmatically open and interact with the Amazon and eBay pages, simulating a real browser to bypass anti-bot detection.
For each supported site (Amazon and eBay), a specific CSS selector is used to target and extract the URLs of product listings.
The scraping process includes dynamic content loading (e.g., scrolling) to ensure that the results are fully loaded before extraction.
Cross-Origin Resource Sharing (CORS):

The back-end is configured to allow cross-origin requests (using the CORS middleware), ensuring smooth communication between the front-end and back-end, even when running on different servers or ports during development.
Stealth Mode:

The Puppeteer Stealth Plugin is utilized to make the headless browser less detectable by e-commerce sites. It masks certain behaviors that are typical of automated browsing, improving the chances of scraping successfully.
Features
Search Product Across Multiple Platforms: The app allows searching for products across Amazon and eBay using a single query.
Real-Time Scraping: The back-end dynamically scrapes the search result pages and provides updated product links.
Stealth Scraping: By using Puppeteer in stealth mode, the scraping process mimics human browsing and avoids being detected by anti-bot systems.
Responsive and User-Friendly Interface: The React front-end provides a clean, responsive, and easy-to-use interface.
CORS Support: Ensures smooth API interaction between different servers, allowing the app to work across domains.
