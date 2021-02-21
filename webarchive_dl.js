const puppeteer = require('puppeteer');
const fs = require('fs');

function programFinished() {
    console.log("Finished!");
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

function sendUrls(urls, i) {
    if (i < urls.length) {
        var entry = urls[i].split("::");
        let name = entry[1];
        name = name.replace('\r', '');
        entry = entry[0];
        run(entry, name, width, height, delayTime, dates, i, urls, reload);
    } else {
        programFinished();
    }
}

async function run(url, name, width, height, delayTime, dates, index, urls, reload) {
    let urlNum = index + 1;
    let total = urls.length;
    console.log("Scanning " + name + ": URL " + urlNum.toString() + " of " + total.toString() + ".");
    console.log("")
    for (i = 0; i < dates.length; i++) {
        console.log("Scanning " + name + " with the date " + dates[i]);
        var fullurl = "https://web.archive.org/web/" + dates[i] + "1200/" + url;
        console.log(fullurl);
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        await page.setViewport({
            width: width,
            height: height,
            isMobile: false
        });
        console.log("Opening " + name + ", waiting until the website has no network activity.");
        await page.goto(fullurl, {waitUntil: ['networkidle0'], timeout: 0});
        var output = await page.evaluate(() => {
            return;
        });
        if (reload == "true") {
            console.log("As reload is enabled in the settings, the page is currently being reloaded.")
            await page.reload({waitUntil: ['networkidle0'], timeout: 0});
        }
        console.log("Page fully loaded, waiting for delay of " + delayTime.toString() + "ms.")
        await delay(delayTime);
        console.log("Delay completed");
        name = name.replace(" ", "_");
        await page.screenshot({ path: 'images/' + name + '_' + dates[i] + '.jpg', type: 'jpeg' });
        console.log("This has been saved in the images folder as " + name + '_' + dates[i] + '.jpg.');
        await page.close();
        await browser.close();
        console.log("");
    }
    index = index + 1;
    sendUrls(urls, index);
}

async function fetch() {
    console.log("webarchive_dl - v1.0.0");
    console.log("----------------------\n");
    fs.readFile('settings.txt', 'utf8' , (err, data) => {
        if (err) {
            console.log("An arror has occured: " + err)
            return
        }
        // DATES - Stored in an array format
        data = data.split("\n");
        dates = data[2].split(":");
        dates = dates[1].trim();
        dates = dates.split(",");
        // WIDTH - Stored in an integer format
        width = data[3].split(":");
        width = width[1].trim();
        width = parseInt(width, 10);
        // HEIGHT - Stored in an integer format
        height = data[4].split(":");
        height = height[1].trim();
        height = parseInt(height, 10);
        // DELAY - Stored in an integer format
        delayTime = data[5].split(":");
        delayTime = delayTime[1].trim();
        delayTime = parseInt(delayTime, 10);
        // RELOAD - Stored in a string format
        reload = data[6].split(":");
        reload = reload[1].trim();
        reload = reload.toLowerCase();
        // URLs - Stored in an array format
        var i;
        var urls = data;
        for (i = 0; i < 12; i++) {
            urls.shift();
        }
        sendUrls(urls, 0);
    })
}

fetch();