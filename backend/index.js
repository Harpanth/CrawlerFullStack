const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const cors = require("cors");

puppeteer.use(StealthPlugin()); // Add stealth plugin to avoid bot detection

const app = express();
const PORT = 3001;

// Predefined configurations for supported websites
const siteConfigs = {
    amazon: {
        baseUrl: "https://www.amazon.com",
        searchUrl: (query) => `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
        productSelector: '[data-component-type="s-search-result"] a.a-link-normal',
    },
    ebay: {
        baseUrl: "https://www.ebay.com",
        searchUrl: (query) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
        productSelector: '.s-item__link',
    },
};

// Middleware to parse JSON and enable CORS
app.use(cors());
app.use(express.json());

// Scraping function
async function scrapeSite(siteName, searchQuery) {
    const config = siteConfigs[siteName];
    if (!config) {
        throw new Error(`Site "${siteName}" is not supported.`);
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set User-Agent to mimic real browser behavior
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    );

    try {
        // Navigate to the search page
        const searchUrl = config.searchUrl(searchQuery);
        console.log(`Navigating to: ${searchUrl}`);
        await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 60000 });

        // Scroll to load dynamic content
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Check if results are available
        const isResultsAvailable = await page.$(config.productSelector);
        if (!isResultsAvailable) {
            console.log(`No results found for ${searchQuery} on ${siteName}`);
            return [];
        }

        // Scrape product URLs
        const productUrls = await page.evaluate((selector) => {
            const links = [];
            document.querySelectorAll(selector).forEach((linkElement) => {
                const link = linkElement.href;
                if (link) {
                    links.push(link);
                }
            });
            return links;
        }, config.productSelector);

        console.log(`Found ${productUrls.length} products on ${siteName}.`);
        return productUrls;
    } catch (error) {
        console.error(`Error scraping ${siteName}: ${error.message}`);
        return [];
    } finally {
        await browser.close();
    }
}

// API Endpoint to scrape all supported sites
app.post("/scrape", async (req, res) => {
    const { product } = req.body;

    if (!product) {
        return res.status(400).json({ error: "Missing 'product' parameter." });
    }

    try {
        const results = {};
        for (const site of Object.keys(siteConfigs)) {
            console.log(`Scraping site: ${site} for product: "${product}"`);
            try {
                const productUrls = await scrapeSite(site, product);
                results[site] = productUrls;
            } catch (error) {
                console.error(`Error scraping ${site}: ${error.message}`);
                results[site] = [];
            }
        }

        res.json({ query: product, results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
