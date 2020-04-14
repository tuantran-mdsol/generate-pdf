var fs = require('fs');
const puppeteer = require('puppeteer');
var path = require("path");



var htmlContent = `<html>Hello World!!! I'm Tuan Tran.</html>`;

(async () => {
    try {
        await fs.writeFileSync('my-page.html', htmlContent, (error) => { console.log(error)});
        await printPDF('my-page.html');
    } catch (e) {
        console.log(e)
    }
})();


async function printPDF(filePath) {
    var contentHtml = fs.readFileSync(filePath, 'utf8');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setContent(contentHtml);
    await page.pdf({ path: "test.pdf", format: 'A4' });
    await browser.close();
  }