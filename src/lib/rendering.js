const puppeteer = require('puppeteer');
const { uuid } = require('uuidv4');
const Jimp = require('jimp');
const fs = require('fs')

// Documentation https://www.npmjs.com/package/jimp
const render_simple_meme = async (data) => {
    var file_name = get_current_time_string() + "_" + Math.floor(Math.random() * 10) + ".jpg"
    var quality = 90;
    await Jimp.read(data.image_url).then(async image => {
        await add_text_to_image(image, data.captions);
        var path = 'src/rendered/' + file_name;
        await image.quality(quality).write(path);

        var file_size_in_kb = await get_file_size_in_kb(path);

        while (file_size_in_kb > data.max_kilobytes && data.max_kilobytes > 0) {
            quality = quality - 5;
            if (quality < 1) {
                return file_name;
            }
            await image.quality(quality).write(path);
            file_size_in_kb = await get_file_size_in_kb(path);
            console.log("Render quality reduced: " + quality + " new size:" + file_size_in_kb + " max size: " + data.max_kilobytes);
        }
    });
    console.log("Render done");
    return file_name;
}

async function zipFile(file) {
    var zip = new require('node-zip')();
    zip.file('test.file', 'zip file');
    var data = zip.generate({base64:false,compression:'DEFLATE'});
    console.log(data); // Debug
    return data;
}   

async function get_file_size_in_kb(path) {
    // gotta wait for the filesystem to show a change.
    await sleep(100); // TODO is there a better way?
    return (await fs.promises.stat(path)).size / 1000;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function findSize() {
    var fileInput = document.getElementById("fUpload");
    try {
        alert(fileInput.files[0].size); // Size returned in bytes.
    } catch (e) {
        var objFSO = new ActiveXObject("Scripting.FileSystemObject");
        var e = objFSO.getFile(fileInput.value);
        var fileSize = e.size;
        alert(fileSize);
    }
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
                posy = Math.round(jimp_image.bitmap.height - 30 + caption.offsetY);
            } else {
                posx = Math.round(jimp_image.bitmap.width / 2 + caption.offsetX);
                posy = Math.round(10 + caption.offsetY);
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

module.exports = { screenshotWebpage, render_simple_meme, zipFile}