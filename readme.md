# webarchive_dl
webarchive_dl is a tool for downloading screenshots of pages from the Internet Archive's Wayback Machine. It's made using Puppeteer and Node.js and is run from the command line.

It's designed to be left for long periods of time to scan through many URLs, and therefore requires no user input once started.

This is an example of a result you can get from the program:

![Example Screenshot](https://i.imgur.com/QZoSJ6m.jpg)

## Installation and use
1. Install node.js - either download the binaries from [nodejs.org](https://nodejs.org/en/download/) or install them from the CLI by typing `brew install node` on Mac or by using your [package manager](https://nodejs.org/en/download/package-manager/) on Linux.
2. Download and extract the zip file from GitHub
3. Open a CLI in the directory of the unzipped folder and type `npm i puppeteer` and `npm i fs`. If an error occurs, check that Node is correctly installed.
4. Open the `settings.txt` file and change the settings to how you wish, adding your URLs at the bottom. The longer the delay time, the more accurate the representation of the page as the images and content will have more time to load.
5. Open your command line, navigate to this folder using the `cd` command and run the program by typing `node webarchive_dl.js`. If there's an error, you may not have installed Node.js correctly.
6. The program will provide you with live information on what the program's doing, and will provide you with the name of each file in the images folder.
7. Once finished, the program will automatically exit. If you wish, you can append code to the `programFinished()` which is executed once the program has finished running to make your PC do something.

## How it works
[Puppeteer](https://developers.google.com/web/tools/puppeteer) is a tool for automating a browsers. The program opens a headless Chromium browser on your computer, meaning that you can't see it. The browser navigates to the page, waits for the page to load and for the length of your delay, then takes a screenshot. The program then saves the screenshot in the images folder.