const puppeteer = require('puppeteer');
const { uuid } = require('uuidv4');
const Jimp = require('jimp');

// Documentation https://www.npmjs.com/package/jimp
const render_simple_meme = async (image_url, top_text, bottom_text, top_x, top_y, bottom_x, bottom_y) => {
    console.log('Doing something...')
    var file_name = get_current_time_string() + "_" + Math.floor(Math.random() * 10) + ".png"
    Jimp.read(image_url, async (err, image) => {
        if (err) throw err;

        await add_text_to_image(image, top_text, top_x, top_y);
        await add_text_to_image(image, bottom_text, bottom_x, bottom_y);
        image
            .quality(60) // set JPEG quality
            .write('src/rendered/' + file_name); // save
        console.log('saved rendered image to ' + file_name)


    });
    await sleep(2000);
    // TODO definitely fix this. I am too stupid rn to just return the file_name when the image is done.
    return file_name;


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function get_current_time_string() {
    var today = new Date();
    var date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
    var time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
    return date + '_' + time;

}

async function add_text_to_image(jimp_image, text, x1, y1) {
    // var text_width = Jimp.measureText(Jimp.FONT_SANS_32_BLACK, 'hmm')
    // var text_height = Jimp.measureTextHeight(Jimp.FONT_SANS_32_BLACK, "asdf", 100);
    // console.log("text_width: " + text_width.toString())
    // console.log("text_height: " + text_height.toString())
    x = parseInt(x1);
    y = parseInt(y1);
    console.log("Printing text " + text + " to: " + x + " x " + y);
    await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
        jimp_image.print(
            font,
            x,
            y,
            {
                text: text,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_TOP
            }
        );
    });
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