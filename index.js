var fs = require('fs');
const yargs = require("yargs");
var path = require("path");
const { createPDFWithLanguage } = require("./utils/pdfHelper")

const options = yargs
 .usage("Usage: -n <name>")
 .option("imagePath", { alias: "imagePath", describe: "The path to screenshot folder.", type: "string", demandOption: true })
 .option("config", { alias: "config", describe: "The configuration of the pdf file.", type: "string", demandOption: false })
 .argv;



var footerTemplate = `<div style="width: 100%;">
<span style="width: 40%; float: left; text-align: left; margin-left:1cm;" class="language"></span>
<span style="width: 40%; float: right; text-align: right; margin-right:1cm;" class="pageNumber"></span>
</div>`;
var headerTemplate = `<span style="width: 40%; float: right; text-align: right; margin-right:1cm;">${new Date()}</span>`;

var config = (options.config == undefined)? {} : JSON.parse(options.config);

if (config.footerTemplate == undefined)
    config.footerTemplate = footerTemplate;
if (config.headerTemplate == undefined)
config.headerTemplate = headerTemplate;

(async () => {
    try {
        fs.readdirSync(options.imagePath).forEach(folderName => {
            config.language = folderName;
            createPDFWithLanguage(path.join(options.imagePath, folderName), config);
        });

    } catch (e) {
        console.log(e)
    }
})();


