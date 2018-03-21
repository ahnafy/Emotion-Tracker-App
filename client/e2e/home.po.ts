import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class HomePage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('');
    }
    static navigateToReports(): promise.Promise<any> {
        return browser.get('/reports');
    }

    //We have added ids specifically for each of the items on the menu bar for E2E tests to r
    //recognize where to highlight and select:
    // Journaling's id is journal Resources's id is rsrc Reports's id is rep //

    // This is where the nav bar E2E tests funcitons are created.

    /*static GoToNavMenu(){
        const input = element (by.id('navBar'));
        input.click();
    }*/

    /*static GoToReports(){
        const input = element (by.id('rep'));
        input.click();
    }
    static GoToJournaling(){
        const input = element (by.id ('journal'));
        input.click();
    }
    static GoToResources(){
        const input = element (by.id('rsrc'));
        input.click();
    }*/

    // This is where the homepage E2E test funcitons are created

    static typeAName(name: string) {
        const input = element(by.id('inputName'));
        input.click();
        input.sendKeys(name);
    }

    // This is where the Insert Emoji (Your mood) E2E test funcitons are created

    static selectTheSlider(){
        const input = element(by.css('mat-slider.slider'));
        input.click();
    }

    static SlideTheSliderUp(){
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }
    static SlideTheSliderDown(){
        browser.actions().sendKeys(Key.ARROW_DOWN).perform();
    }

    static selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    static backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    clickSubmitButton(): promise.Promise<void> {
        this.highlightElement(by.id('submitEmoji'));

        return element(by.buttonText('Submit')).click();
    }





    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getUserTitle() {
        const title = element(by.id('user-list-title')).getText();
        this.highlightElement(by.id('user-list-title'));

        return title;
    }




    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('submitEmoji'));
        return element(by.id('submitEmjoji')).isPresent();
    }


    clickSldier(): promise.Promise<void> {
        this.highlightElement(by.id('slider'));
        return element(by.id('slider')).click();
    }

    static filterOwner(name: string) {
        const input = element(by.id('emojiOwner'));
        input.click();
        input.sendKeys(name);
    }
        getUniqueOwner() {
        const owner = element(by.id('test')).getText();
        this.highlightElement(by.id('test'));

        return owner;
    }

}
