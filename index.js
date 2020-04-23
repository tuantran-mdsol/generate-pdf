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
<span style="width: 40%; float: left; text-align: left; margin-left:1cm;" class="language">Vietnam - Vietnamese</span>
<span style="width: 40%; float: right; text-align: right; margin-right:1cm;" class="pageNumber"></span>
</div>`;
var time = new Date();
var config = (options.config == undefined)? {} : JSON.parse(options.config)
var headerTemplate = `<span style="width: 40%; float: right; text-align: right; margin-right:1cm;">${time}</span>`;

config.env = 'sanbox';
config.device = 'iPhone 8 Plus';
config.studyName = 'kms_automation_21012020';
config.loginName = 'testmcc15@test.com';

(async () => {
    try {
        config.footerTemplate = footerTemplate;
        config.headerTemplate = headerTemplate;
        fs.readdirSync(options.imagePath).forEach(fileName => {
            createPDFWithLanguage(path.join(options.imagePath, fileName), config);
        });

    } catch (e) {
        console.log(e)
    }
})();


