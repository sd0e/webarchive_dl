const puppeteer = require('puppeteer');
const fs = require('fs');

function returnVersion() {
    return "v1.0.0";
}

function programFinished() {
    console.log("(" + timeNow() + ") Finished!");
}

function timeNow() {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
        run(entry, name, width, height, delayTime, dates, i, urls, reload, firstDelayTime);
    } else {
        programFinished();
    }
}

async function run(url, name, width, height, delayTime, dates, index, urls, reload, firstDelayTime) {
    let urlNum = index + 1;
    let total = urls.length;
    console.log("(" + timeNow() + ") Scanning " + name + ": URL " + urlNum.toString() + " of " + total.toString() + ".");
    console.log("")
    for (i = 0; i < dates.length; i++) {
        console.log("(" + timeNow() + ") Scanning " + name + " with the date " + dates[i]);
        var fullurl = "https://web.archive.org/web/" + dates[i] + "1200/" + url;
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        await page.setViewport({
            width: width,
            height: height,
            isMobile: false
        });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36 webarchive-dl');
        console.log("(" + timeNow() + ") Opening " + name + ", waiting until the website has no network activity.");
        await page.goto(fullurl, {waitUntil: ['networkidle0'], timeout: 0});
        var output = await page.evaluate(() => {
            return;
        });
        console.log("(" + timeNow() + ") Page fully loaded, waiting for first delay of " + firstDelayTime.toString() + "ms before reloading to account for redirects.")
        await delay(firstDelayTime);
        if (reload == "true") {
            console.log("(" + timeNow() + ") As reload is enabled in the settings, the page is currently being reloaded.")
            await page.reload({waitUntil: ['networkidle0'], timeout: 0});
        }
        console.log("(" + timeNow() + ") Page fully loaded, waiting for delay of " + delayTime.toString() + "ms.")
        await delay(delayTime);
        console.log("(" + timeNow() + ") Delay completed");
        name = name.replace(" ", "_");
        await page.screenshot({ path: 'images/' + name + '_' + dates[i] + '.jpg', type: 'jpeg' });
        console.log("(" + timeNow() + ") This has been saved in the images folder as " + name + '_' + dates[i] + '.jpg.');
        await page.close();
        await browser.close();
        console.log("");
    }
    index = index + 1;
    sendUrls(urls, index);
}

async function fetch() {
    console.log("----------------------------------------------");
    console.log("webarchive_dl - " + returnVersion());
    console.log("https://github.com/sd0e/webarchive_dl");
    console.log("----------------------------------------------\n");
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
        // FIRSTDELAY - Stored in an integer format
        firstDelayTime = data[7].split(":");
        firstDelayTime = firstDelayTime[1].trim();
        firstDelayTime = parseInt(firstDelayTime, 10);
        // RELOAD - Stored in a string format
        reload = data[6].split(":");
        reload = reload[1].trim();
        reload = reload.toLowerCase();
        // URLs - Stored in an array format
        var i;
        var urls = data;
        for (i = 0; i < 13; i++) {
            urls.shift();
        }
        sendUrls(urls, 0);
    })
}

fetch();
