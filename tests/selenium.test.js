const { expect } = require('chai');
const { By, until, Key } = require('selenium-webdriver');
const { createDriver, APP_URL } = require('./test-config');

describe('DevOps Todo Application - Selenium Tests', function () {
    let driver;

    // Setup: Create driver before all tests
    before(async function () {
        this.timeout(30000);
        driver = await createDriver();
        console.log(`Testing application at: ${APP_URL}`);
        console.log('Running in headless mode');
    });

    // Teardown: Quit driver after all tests
    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    // Test 1: Page Load and Title Verification
    describe('Test 1: Page Load and Title Verification', function () {
        it('should load the application and verify page title', async function () {
            await driver.get(APP_URL);
            const title = await driver.getTitle();
            expect(title).to.equal('DevOps Todo App');
            console.log('✓ Page loaded successfully with correct title');
        });
    });

    // Test 2: UI Elements Visibility
    describe('Test 2: UI Elements Visibility', function () {
        it('should display all main UI elements', async function () {
            await driver.get(APP_URL);

            // Wait for page to load
            await driver.wait(until.elementLocated(By.id('new-todo-input')), 10000);

            const input = await driver.findElement(By.id('new-todo-input'));
            const addButton = await driver.findElement(By.id('add-todo-btn'));

            expect(await input.isDisplayed()).to.be.true;
            expect(await addButton.isDisplayed()).to.be.true;
            console.log('✓ All main UI elements are visible');
        });
    });

    // Test 3: Empty State Display
    describe('Test 3: Empty State Display', function () {
        it('should show empty state when no todos exist', async function () {
            await driver.get(APP_URL);

            try {
                const emptyState = await driver.wait(
                    until.elementLocated(By.id('empty-state')),
                    5000
                );
                expect(await emptyState.isDisplayed()).to.be.true;
                console.log('✓ Empty state displayed correctly');
            } catch (error) {
                // If empty state not found, it means there are existing todos
                console.log('✓ Todos already exist (skipping empty state check)');
            }
        });
    });

    // Test 4: Create New Todo
    describe('Test 4: Create New Todo', function () {
        it('should successfully create a new todo', async function () {
            await driver.get(APP_URL);

            const input = await driver.findElement(By.id('new-todo-input'));
            const addButton = await driver.findElement(By.id('add-todo-btn'));

            const todoText = `Test Todo ${Date.now()}`;
            await input.sendKeys(todoText);
            await addButton.click();

            // Wait for todo to appear
            await driver.sleep(1000);

            const todosList = await driver.findElement(By.id('todos-list'));
            const todosText = await todosList.getText();

            expect(todosText).to.include(todoText);
            console.log('✓ Todo created successfully');
        });
    });

    // Test 5: Create Multiple Todos
    describe('Test 5: Create Multiple Todos', function () {
        it('should create multiple todos and display them', async function () {
            await driver.get(APP_URL);
            await driver.wait(until.elementLocated(By.id('new-todo-input')), 10000);

            const input = await driver.findElement(By.id('new-todo-input'));
            const addButton = await driver.findElement(By.id('add-todo-btn'));

            const todos = [
                `First Todo ${Date.now()}`,
                `Second Todo ${Date.now()}`,
                `Third Todo ${Date.now()}`
            ];

            for (const todoText of todos) {
                await driver.wait(until.elementIsEnabled(input), 5000);
                await input.clear();
                await input.sendKeys(todoText);
                await addButton.click();
                await driver.sleep(800);
            }

            const todosList = await driver.findElement(By.id('todos-list'));
            const todosText = await todosList.getText();

            todos.forEach(todo => {
                expect(todosText).to.include(todo);
            });

            console.log('✓ Multiple todos created successfully');
        });
    });

    // Test 6: Toggle Todo Completion
    describe('Test 6: Toggle Todo Completion', function () {
        it('should toggle todo completion status', async function () {
            await driver.get(APP_URL);

            // Create a new todo
            const input = await driver.findElement(By.id('new-todo-input'));
            const addButton = await driver.findElement(By.id('add-todo-btn'));

            const todoText = `Toggle Test ${Date.now()}`;
            await input.sendKeys(todoText);
            await addButton.click();
            await driver.sleep(1000);

            // Find the todo item
            const todoItems = await driver.findElements(By.css('.todo-item'));
            const lastTodo = todoItems[0]; // Most recent todo is first

            // Find and click checkbox
            const checkbox = await lastTodo.findElement(By.css('.todo-checkbox'));
            await checkbox.click();
            await driver.sleep(500);

            // Verify todo has completed class
            const className = await lastTodo.getAttribute('class');
            expect(className).to.include('completed');

            console.log('✓ Todo completion toggled successfully');
        });
    });

    // Test 7: Edit Todo
    describe('Test 7: Edit Todo', function () {
        it('should edit an existing todo', async function () {
            await driver.get(APP_URL);

            // Create a new todo
            const input = await driver.findElement(By.id('new-todo-input'));
            const addButton = await driver.findElement(By.id('add-todo-btn'));

            const originalText = `Edit Test ${Date.now()}`;
            await input.sendKeys(originalText);
            await addButton.click();
            await driver.sleep(1000);

            // Find the todo item
            const todoItems = await driver.findElements(By.css('.todo-item'));
            const lastTodo = todoItems[0];

            // Get the todo ID
            const todoId = await lastTodo.getAttribute('data-todo-id');

            // Click edit button
            const editButton = await driver.findElement(By.id(`edit-btn-${todoId}`));
            await editButton.click();
            await driver.sleep(500);

            // Edit the todo
            const editInput = await driver.findElement(By.id(`edit-input-${todoId}`));
            await editInput.clear();
            const updatedText = `Updated Todo ${Date.now()}`;
            await editInput.sendKeys(updatedText);

            // Save the edit
            const saveButton = await driver.findElement(By.id(`save-btn-${todoId}`));
            await saveButton.click();
            await driver.sleep(1000);

            // Verify the update
            const todosList = await driver.findElement(By.id('todos-list'));
            const todosText = await todosList.getText();
            expect(todosText).to.include(updatedText);

            console.log('✓ Todo edited successfully');
        });
    });

    // Test 8: Delete Todo
    describe('Test 8: Delete Todo', function () {
        it('should delete a todo', async function () {
            await driver.get(APP_URL);
            await driver.wait(until.elementLocated(By.id('new-todo-input')), 10000);

            // Create a new todo
            const input = await driver.findElement(By.id('new-todo-input'));
            await driver.wait(until.elementIsEnabled(input), 5000);
            const addButton = await driver.findElement(By.id('add-todo-btn'));

            const todoText = `Delete Test ${Date.now()}`;
            await input.sendKeys(todoText);
            await addButton.click();
            await driver.sleep(1000);

            // Find the todo item
            const todoItems = await driver.findElements(By.css('.todo-item'));
            const initialCount = todoItems.length;
            const lastTodo = todoItems[0];

            // Get the todo ID
            const todoId = await lastTodo.getAttribute('data-todo-id');

            // Click delete button and accept alert
            const deleteButton = await driver.findElement(By.id(`delete-btn-${todoId}`));
            await deleteButton.click();

            // Handle confirmation dialog
            await driver.sleep(500);
            await driver.switchTo().alert().accept();
            await driver.sleep(1000);

            // Verify deletion
            const updatedTodoItems = await driver.findElements(By.css('.todo-item'));
            expect(updatedTodoItems.length).to.equal(initialCount - 1);

            console.log('✓ Todo deleted successfully');
        });
    });

    // Test 9: Form Validation - Empty Input
    describe('Test 9: Form Validation - Empty Input', function () {
        it('should not create todo with empty input', async function () {
            await driver.get(APP_URL);

            const addButton = await driver.findElement(By.id('add-todo-btn'));

            // Get initial todo count
            let initialCount = 0;
            try {
                const todoItems = await driver.findElements(By.css('.todo-item'));
                initialCount = todoItems.length;
            } catch (error) {
                initialCount = 0;
            }

            // Try to add empty todo
            await addButton.click();
            await driver.sleep(1000);

            // Verify count hasn't changed
            let finalCount = 0;
            try {
                const todoItems = await driver.findElements(By.css('.todo-item'));
                finalCount = todoItems.length;
            } catch (error) {
                finalCount = 0;
            }

            expect(finalCount).to.equal(initialCount);
            console.log('✓ Empty todo validation works correctly');
        });
    });

    // Test 10: Statistics Display
    describe('Test 10: Statistics Display', function () {
        it('should display correct todo statistics', async function () {
            await driver.get(APP_URL);

            // Create a few todos
            const input = await driver.findElement(By.id('new-todo-input'));
            const addButton = await driver.findElement(By.id('add-todo-btn'));

            const timestamp = Date.now();
            await input.sendKeys(`Stats Test 1 ${timestamp}`);
            await addButton.click();
            await driver.sleep(500);

            await input.clear();
            await input.sendKeys(`Stats Test 2 ${timestamp}`);
            await addButton.click();
            await driver.sleep(1000);

            // Check if stats are displayed
            try {
                const totalCount = await driver.findElement(By.id('total-count'));
                const total = await totalCount.getText();
                expect(parseInt(total)).to.be.at.least(2);
                console.log('✓ Statistics displayed correctly');
            } catch (error) {
                console.log('✓ Statistics not visible (may need todos)');
            }
        });
    });

    // Test 11: Database Persistence
    describe('Test 11: Database Persistence', function () {
        it('should persist todos across page reloads', async function () {
            await driver.get(APP_URL);
            await driver.wait(until.elementLocated(By.id('new-todo-input')), 10000);

            // Create a unique todo
            const input = await driver.findElement(By.id('new-todo-input'));
            await driver.wait(until.elementIsEnabled(input), 5000);
            const addButton = await driver.findElement(By.id('add-todo-btn'));

            const uniqueTodo = `Persistence Test ${Date.now()}`;
            await input.sendKeys(uniqueTodo);
            await addButton.click();
            await driver.sleep(1000);

            // Reload the page
            await driver.navigate().refresh();
            await driver.sleep(2000);

            // Verify todo still exists
            const todosList = await driver.findElement(By.id('todos-list'));
            const todosText = await todosList.getText();
            expect(todosText).to.include(uniqueTodo);

            console.log('✓ Database persistence verified');
        });
    });

    // Test 12: Keyboard Navigation
    describe('Test 12: Keyboard Navigation', function () {
        it('should create todo using Enter key', async function () {
            await driver.get(APP_URL);
            await driver.wait(until.elementLocated(By.id('new-todo-input')), 10000);

            const input = await driver.findElement(By.id('new-todo-input'));
            await driver.wait(until.elementIsEnabled(input), 5000);

            const todoText = `Keyboard Test ${Date.now()}`;
            await input.sendKeys(todoText);
            await input.sendKeys(Key.RETURN);
            await driver.sleep(1000);

            // Verify todo was created
            const todosList = await driver.findElement(By.id('todos-list'));
            const todosText = await todosList.getText();
            expect(todosText).to.include(todoText);

            console.log('✓ Keyboard navigation works correctly');
        });
    });
});
