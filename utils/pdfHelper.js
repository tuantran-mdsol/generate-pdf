const puppeteer = require('puppeteer');
const { updateHTMLNode, createHTMLContentForLanguage } = require('./xmlHelpler')
var fs = require('fs');

async function createPDFWithLanguage(folderPath, config){

    var footerTemplate = (config.footerTemplate == undefined) ? undefined : 
    `
    <div style="color: lightgray; border-top: solid lightgray 1px; font-size: 10px; padding-top: 5px; text-align: center; width: 100%;">
    ${config.footerTemplate}
    </div>
    `;

    var headerTemplate = (config.headerTemplate == undefined) ? undefined : 
    `
    <div style="color: lightgray; border-bottom: solid lightgray 1px; font-size: 10px; padding-bottom: 5px; text-align: center; width: 100%;">
    ${config.headerTemplate}
    </div>
    `;

    headerTemplate = updateHTMLNode(headerTemplate, config);
    footerTemplate = updateHTMLNode(footerTemplate, config);

    var htmlContent = await createHTMLContentForLanguage(folderPath, config);
    var htmlFileName = folderPath.replace("/", "-") + ".html";
    await createHTMLFile(htmlFileName, htmlContent);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    await page.pdf({ 
        path: `${htmlFileName.replace(".html", ".pdf")}`, 
        format: 'A4',
        displayHeaderFooter: headerTemplate !== undefined || footerTemplate !== undefined,
        footerTemplate: footerTemplate,
        headerTemplate: headerTemplate,
        margin: {
            bottom: 70, // minimum required for footer msg to display
            left: 35,
            right: 35,
            top: 70,
        },
        printBackground: true,
    });

    await browser.close();

}

async function createHTMLFile(fileName, htmlContent){
    fs.writeFileSync(fileName, htmlContent, (error) => { console.log(error)});
}

module.exports = { createPDFWithLanguage }