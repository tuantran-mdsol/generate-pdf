const cheerio = require('cheerio');
const { create } = require('xmlbuilder2');
var fs = require('fs');
var path = require("path");

async function createHTMLContentForLanguage(folderPath, config){

    var rootXML = `<html>
        <head>
        <style>
        body {
            margin: 0;
            padding: 0;
            font: 12pt "Tahoma";
        }
        .vertical-center {
            display:flex;
            justify-content:center;
            align-items:center;
            height:100%;
        }
        .center {
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        * {
            box-sizing: border-box;
            -moz-box-sizing: border-box;
        }
        .page {
            width: 21cm;
            min-height: 29.7cm;
            background: white;
        }
        .subpage {
            padding: 1cm;
            border: 5px solid;
            height: 237mm;
            outline: 2cm solid;
        }
        .form {
            width: 21cm;
            min-height: 26.5cm;
            background: white;
        }

        .screenImage {
            outline: 1px;
            min-height: 25.5cm;
        }

        img {
            display: block;
            max-height: 24.7cm;
            width: auto;
            height: auto;
        }
        
        @media print {
            .page {
                margin: 0;
                border: initial;
                border-radius: initial;
                width: initial;
                min-height: initial;
                box-shadow: initial;
                background: initial;
                page-break-after: always;
            }
            .vertical-center {
                display:flex;
                justify-content:center;
                align-items:center;
                height:100%;
            }
        }
        </style>
        </head>
        </html>`;
    var body  = create(rootXML)
                .root()
                .ele('body');
    
    body.ele('div', {class : 'coverPage page'})
            .ele('div', {class : 'vertical-center'})
            .ele('div', {style: 'font-size: 24px'})
            .ele('div').txt(`Login name: ${config.loginName}`).up()
            .ele('div').txt(`Study name: ${config.studyName}`).up()
            .ele('div').txt(`Supported Language: ${config.language}`).up()
            .ele('div').txt(`Enviroment: ${config.env}`).up()
            .ele('div').txt(`Device: ${config.device}`).up()
            .up().up()
    
    fs.readdirSync(folderPath).forEach(formName => {
        var formDiv = body.ele('div', {class : 'page'}).txt(`Form Name: ${formName}`)
        var formPath = path.join(folderPath, formName);

        fs.readdirSync(formPath).forEach(imageName => {
            var imagePath = path.join(formPath, imageName);
            var imageBase64 = fs.readFileSync(imagePath, {encoding: 'base64'});
            
            formDiv.ele('div', {class : 'screenImage'}).txt(imageName.trim())
                .ele('img', {
                    alt: imageName,
                    src: `data:image/png;base64,${imageBase64}`,
                    border: 1,
                    class: 'center'
                }).up();
        })

    });
    return body.end({ prettyPrint: true });
}

function updateHTMLNode(htmlNode, config){
    const $ = cheerio.load(htmlNode, {
        xmlMode: true
    });
    if (config.language !== undefined)
        $('.language').text(config.language);
    
    return $.xml();
}

module.exports = { updateHTMLNode, createHTMLContentForLanguage }