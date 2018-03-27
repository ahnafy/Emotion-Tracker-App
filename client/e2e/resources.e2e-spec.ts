import {ResourcesPage} from './resources.po';
/*import {AppPage} from './app.po';*/
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';


const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
    let args = arguments;

    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    // If you're tired of it taking long you can remove this call
    origFn.call(browser.driver.controlFlow(), function () {
        return protractor.promise.delayed(100);
    });

    return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Resources Page', () => {
    let page: ResourcesPage;

    beforeEach(() => {
        page = new ResourcesPage();
    });

    it('should get and highlight Resources title attribute ', () => {
        ResourcesPage.navigateTo();
        expect(page.getResourceTitle()).toEqual('Your Contacts');
    });

    it('Should have an Add your own contact button', () => {
        ResourcesPage.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should actually add the user with the information we put in the fields', () => {
        ResourcesPage.navigateTo();
        page.clickAddContactButton();
        element(by.id('nameField')).sendKeys('Kai Zang');
        element(by.id('emailField')).sendKeys('kai@kai.com');
        element(by.id('phonenumberField')).sendKeys('1234567890');
        element(by.id('confirmAddresourcesButton')).click();
        setTimeout(() => {
             expect(page.getUniqueContact('kai@kai.com')).toEqual('Kai Zang');
         }, 10000);
     });

    /*it('Should actually see the user we added in crisis button', () => {
        ResourcesPage.navigateTo();
        page.clickAddContactButton();
        element(by.id('nameField')).sendKeys('Kai Zang');
        element(by.id('emailField')).sendKeys('kai@kai.com');
        element(by.id('phonenumberField')).sendKeys('1234567890');
        element(by.id('confirmAddresourcesButton')).click();
        page.clickCrisisButton();
        setTimeout(() => {
            expect(page.getUniqueContact('kai@kai.com')).toEqual('Kai Zang');
        }, 10000);
    });*/


    it('should click on the Suicide Prevention Lifeline element, and the correct phone number is on the page', () => {
        ResourcesPage.navigateTo();
        ResourcesPage.clickElement('suicide-prevention-lifeline');
        expect(element(by.binding('1-800-273-8255'))).toBeDefined();
    });

    it('should click on the Crisis Hotline element', () => {
        ResourcesPage.navigateTo();
        ResourcesPage.clickElement('crisis-hotline');
        expect(element(by.binding('775-784-8090'))).toBeDefined();

    });

    it('should click on the Crisis Text Line element, then click on the woodland home element inside it, and the correct phone number is on the page', () => {
        ResourcesPage.navigateTo();
        ResourcesPage.clickElement('crisis-text-line');
        ResourcesPage.clickElement('woodland-home');
    });
});
