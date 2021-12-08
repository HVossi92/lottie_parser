const renderLottie = require('puppeteer-lottie')
const fs = require('fs')
const path = require('path')
const num = 4
//const inputFile = `/Users/h.vosskamp/Documents/Private/Hagen/2021_22_WiSe/Master_Thesis/Webscraping/Lottie_Jsons/lottie_json_${num}.json`
//const inputFile = `/Users/h.vosskamp/Documents/Private/Hagen/2021_22_WiSe/Master_Thesis/Webscraping/Lottie_Jsons/`
const inputFile = `/Users/h.vosskamp/Documents/Private/Hagen/2021_22_WiSe/Master_Thesis/Webscraping/Lottie_Jsons/part_0`
const outputFolder = '/Users/h.vosskamp/Documents/Private/Hagen/2021_22_WiSe/Master_Thesis/Webscraping/Lottie_gifs/'

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

readFiles()

function readFiles() {
    const jsonsInDir = fs.readdirSync(inputFile).filter(file => path.extname(file) === '.json');

    jsonsInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join(inputFile, file));
        let json

        try {
            json = JSON.parse(fileData.toString());
        } catch (e) {
            console.log(e)
            return
        }

        console.log(inputFile)
        try {
            if (isArray(json)) {
                json.forEach(element => treatFile(element))
            } else {
                treatFile(json)
            }
        } catch (e) {
            console.log(e)
        }
        console.log("Finished")
    });
}

function treatFile(json) {
    const lottie = getValidLottie(json)
    render(lottie)
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function getValidLottie(json) {
    const data = json.data
    if (data === undefined) {
        return json
    }
    return data
}

async function render(file) {
    let outputFile = `${outputFolder}/${file.nm}`
    if (fs.existsSync(outputFile + '.gif') || fs.existsSync(outputFile + '.txt')) {
        return
    }
    fs.writeFileSync(outputFile + '.txt', "Placeholder")
    await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('timeout'))
        }, 60000) // wait 10 sec
        renderLottie({
            animationData: file,
            output: outputFile + '.gif'
        }).then(value => {
            fs.unlinkSync(outputFile + '.txt')
            clearTimeout(timeoutId)
            resolve(value)
        })
    })
}
