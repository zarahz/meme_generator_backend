const puppeteer = require('puppeteer');
const { uuid } = require('uuidv4');



const screenshotWebpage = async (webpage_url) => {
    // code copied from: https://bitsofco.de/using-a-headless-browser-to-capture-page-screenshots/

    // 1. Launch the browser
    const browser = await puppeteer.launch();
    // 2. Open a new page
    const page = await browser.newPage();
    // 3. Navigate to URL
    await page.goto(webpage_url);
    // 4. Take screenshot
    const someID = uuid();
    await page.screenshot({ path: 'temp/screenshot_' + someID + '.png' });
    await browser.close();
};


module.exports = { screenshotWebpage }