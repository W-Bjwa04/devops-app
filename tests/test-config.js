const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuration
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const HEADLESS = process.env.HEADLESS !== 'false'; // Default to headless

function getChromeOptions() {
    const options = new chrome.Options();

    if (HEADLESS) {
        options.addArguments('--headless=new');
    }

    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--disable-extensions');
    options.addArguments('--disable-software-rasterizer');

    return options;
}

async function createDriver() {
    const options = getChromeOptions();

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    await driver.manage().setTimeouts({ implicit: 10000 });

    return driver;
}

module.exports = {
    APP_URL,
    HEADLESS,
    createDriver,
    getChromeOptions,
};
