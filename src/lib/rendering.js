const puppeteer = require('puppeteer');
const { uuid } = require('uuidv4');


const render_simple_meme = async (image_url, top_text, bottom_text, top_x, top_y, bottom_x, bottom_y) => {

}


const screenshotWebpage = async (webpage_url) => {
    // code copied from: https://bitsofco.de/using-a-headless-browser-to-capture-page-screenshots/

    // 1. Launch the browser
    const browser = await puppeteer.launch();
    // 2. Open a new page
    const page = await browser.newPage();
    // 3. Navigate to URL
    await page.goto(webpage_url);

    // path variables
    const fileName = "screenshot_" + uuid();
    const fileType = '.png';
    const path = 'templates/' + fileName + fileType
    // 4. Take screenshot
    await page.screenshot({ path: "src/templates/" + fileName + fileType });
    await browser.close();
    let tags = "screenshot webpage";
    let url = ("http://localhost:3000/static-templates/" + fileName + fileType);

    return {
        fileName,
        tags,
        url,
        fileType,
        nameAndFileType: fileName + fileType,
        path,
        isWebScreenshot: true
    }
};

module.exports = { screenshotWebpage, render_simple_meme }