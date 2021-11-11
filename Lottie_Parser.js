const renderLottie = require('puppeteer-lottie')
const fs = require('fs')
const num = 4
const inputFile = `/home/vossi/Documents/Master_Thesis/WebScraping/Scraped_Data/lottie_jsons/lottie_json_${num}.json`
const outputFolder = '/home/vossi/Documents/Master_Thesis/WebScraping/Scraped_Data/lottie_gifs/'

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});
readFiles()

function readFiles() {
    console.log(inputFile)
    const fileData = fs.readFileSync(inputFile);
    const json = JSON.parse(fileData.toString());
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
