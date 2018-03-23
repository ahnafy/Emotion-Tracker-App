import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class JournalPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/journals');
    }

    static typeASubject(subject: string) {
        const input = element(by.id('journalSubject'));
        input.click();
        input.sendKeys(subject);
    }

    static typeABody(body: string) {
        const input = element(by.id('journalBody'));
        input.click();
        input.sendKeys(body);
    }

    static backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    static getJournals() {
        return element.all(by.className('journals'));
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

    getJournalTitle() {
        const title = element(by.id('journal-list-title')).getText();
        this.highlightElement(by.id('journal-list-title'));

        return title;
    }


    getUniqueJournal(id: string) {
        const journal = element(by.id(id)).getText();
        this.highlightElement(by.id(id));

        return journal;
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewJournal'));
        return element(by.id('addNewJournal')).isPresent();
    }

    clickAddJournalButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewJournal'));
        return element(by.id('addNewJournal')).click();
    }

}
