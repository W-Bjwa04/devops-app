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

    // Core security and sandbox flags
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--disable-extensions');
    options.addArguments('--disable-software-rasterizer');
    
    // SSL/Certificate handling
    options.addArguments('--ignore-certificate-errors');
    options.addArguments('--ignore-ssl-errors');
    options.addArguments('--ignore-certificate-errors-spki-list');
    options.addArguments('--allow-insecure-localhost');
    options.addArguments('--disable-web-security');
    options.addArguments('--allow-running-insecure-content');
    options.addArguments('--unsafely-treat-insecure-origin-as-secure=http://app:3000');
    
    // Disable features that might interfere
    options.addArguments('--disable-features=VizDisplayCompositor,IsolateOrigins,site-per-process');
    options.addArguments('--disable-blink-features=AutomationControlled');
    options.addArguments('--disable-site-isolation-trials');
    
    // Set preferences to avoid SSL issues
    options.setUserPreferences({
        'profile.default_content_setting_values.mixed_content': 1,
        'profile.managed_default_content_settings.mixed_content': 1
    });

    return options;
}

async function createDriver() {
    const options = getChromeOptions();
    
    // Set Chromium binary location
    options.setChromeBinaryPath('/usr/bin/chromium');
    
    // Add remote debugging for better stability
    options.addArguments('--remote-debugging-port=9222');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
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
    getChromeOptions,
};
