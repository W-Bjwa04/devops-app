const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const APP_URL = 'http://localhost:3000';

(async function runTests() {
  let driver;

  try {
    console.log('Starting Selenium tests...');

    let options = new chrome.Options();
    options.addArguments('--headless'); 
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // --- Test 1: Signup Flow ---
    console.log('Test 1: Testing Signup...');
    await driver.get(`${APP_URL}/signup`);

    const testEmail = `testuser_${Date.now()}@example.com`;
    const testPassword = 'password123';

    await driver.findElement(By.css('input[type="text"]')).sendKeys('Test User');
    await driver.findElement(By.css('input[type="email"]')).sendKeys(testEmail);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(testPassword);
    
    // Click signup button
    const signupButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign Up')]"));
    await signupButton.click();

    // Wait for redirect to login
    await driver.wait(until.urlContains('/login'), 5000);
    console.log('Signup successful, redirected to login.');

    // --- Test 2: Login Flow ---
    console.log('Test 2: Testing Login...');
    
    // We should be on the login page now
    await driver.findElement(By.css('input[type="email"]')).sendKeys(testEmail);
    await driver.findElement(By.css('input[type="password"]')).sendKeys(testPassword);

    // Click login button
    const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Login')]"));
    await loginButton.click();

    // Wait for redirect to dashboard (home)
    await driver.wait(until.urlIs(`${APP_URL}/`), 5000);
    console.log('Login successful, redirected to dashboard.');

    // --- Test 3: Dashboard Content ---
    console.log('Test 3: Verifying Dashboard Content...');
    
    // Check for "Site is in Progress" text
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    
    if (bodyText.includes('Site is in Progress')) {
        console.log('Dashboard correctly shows "Site is in Progress".');
    } else {
        throw new Error('Dashboard does not contain "Site is in Progress" message.');
    }

    // Check if user name is displayed
    if (bodyText.includes('Test User')) {
        console.log('Dashboard correctly shows user name.');
    } else {
        throw new Error('Dashboard does not show the logged-in user name.');
    }

    console.log('All tests passed!');

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();
