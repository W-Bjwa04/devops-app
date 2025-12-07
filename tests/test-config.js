const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

// Configuration
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const HEADLESS = process.env.HEADLESS !== 'false'; // Default to headless

function getFirefoxOptions() {
    const options = new firefox.Options();

    if (HEADLESS) {
        options.addArguments('-headless');
    }

    // Window size for consistent testing
    options.addArguments('--width=1920');
    options.addArguments('--height=1080');
    
    // Firefox preferences for HTTP testing
    options.setPreference('network.stricttransportsecurity.preloadlist', false);
    options.setPreference('security.mixed_content.block_active_content', false);

    return options;
}

async function createDriver() {
    const options = getFirefoxOptions();

    const driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();

    await driver.manage().setTimeouts({ implicit: 10000 });
    
    // Set page load strategy
    await driver.manage().setTimeouts({ pageLoad: 30000 });

    return driver;
}

module.exports = {
    APP_URL,
    HEADLESS,
    createDriver,
    getFirefoxOptions,
};
