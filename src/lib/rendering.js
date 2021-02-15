const puppeteer = require('puppeteer');
const { uuid } = require('uuidv4');
const Jimp = require('jimp');

// Documentation https://www.npmjs.com/package/jimp
const render_simple_meme = async (data) => {
    console.log('Doing something...')
    var file_name = get_current_time_string() + "_" + Math.floor(Math.random() * 10) + ".png"

    Jimp.read(data.image_url).then(async image => {
        console.log("HEIGHT " + image.bitmap.height);
        await add_text_to_image(image, data.captions);

        image
            .quality(60) // set JPEG quality
            .write('src/rendered/' + file_name); // save
        console.log('saved rendered image to ' + file_name)
    });

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

async function add_text_to_image(jimp_image, captions) {

    await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
        captions.forEach(caption => {
            let posx = 0;
            let posy = 0;
            if (caption.fromBottom) {
                posx = Math.round(jimp_image.bitmap.width / 2 + caption.offsetX);
                posy = Math.round(jimp_image.bitmap.height - 30 + caption.offsetX);
            } else {
                posx = Math.round(jimp_image.bitmap.width / 2 + caption.offsetX);
                posy = Math.round(10 + caption.offsetX);
            }

            console.log(jimp_image.bitmap.width + "x" + jimp_image.bitmap.height + "-> (" + posx + ", " + posy + ")")
            //Beware bottom text (fromBottom = true in caption) won't show due to negative Y!
            jimp_image.print(
                font,
                posx,
                posy,
                {
                    text: caption.text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_TOP
                }
            );
        });
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