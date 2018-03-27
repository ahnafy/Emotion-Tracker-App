import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class ReportPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/reports');
    }

    static typeAOwner(subject: string) {
        const input = element(by.id('emojiOwner'));
        input.click();
        input.sendKeys(subject);
    }

    static backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    static getReports() {
        return element.all(by.className('reports'));
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

    getReportOwner() {
        const title = element(by.id('emojiOwner')).getText();
        this.highlightElement(by.id('emojiOwner'));

        return title;
    }


    getUniqueReport(id: string) {
        const report = element(by.id(id)).getText();
        this.highlightElement(by.id(id));

        return report;
    }

    getReportsTitle() {
        const title = element(by.id('reports-title')).getText();
        this.highlightElement(by.id('reports-title'));

        return title;
    }


}
