import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class GoalsPage {
    static navigateTo(): promise.Promise<any> {
        return browser.get('/goals');
    }


    //We have added ids specifically for each of the items on the menu bar for E2E tests to r
    //recognize where to highlight and select:
    // Journaling's id is journal Resources's id is rsrc Reports's id is rep //
    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/

    static highlightElement(byObject) {
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


    static addGoalButtonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewGoal'));
        return element(by.id('addNewGoal')).isPresent();
    }

    static clickAddGoalButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewGoal'));
        return element(by.id('addNewGoal')).click();
    }


    static goalExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('test'));
        return element(by.id('test')).isPresent();
    }

    static clickGoal(): promise.Promise<void> {
        this.highlightElement(by.id('test'));
        return element(by.id('test')).click();
    }

    static typeOwner(): promise.Promise<void> {
        this.highlightElement(by.id('ownerField'));
        return element(by.id('ownerField')).sendKeys('Jake');

    }

    static typeGoalName(): promise.Promise<void> {
        this.highlightElement(by.id('nameField'));
        return element(by.id('nameField')).sendKeys('Test Goals');
    }

    static typeCategory(): promise.Promise<void> {
        this.highlightElement(by.id('category'));
        return element(by.id('category')).sendKeys('Work');
    }

    static typeStartDate(): promise.Promise<void> {
        this.highlightElement(by.id('startDate'));
        return element(by.id('startDate')).sendKeys('Thu Feb 21 2013 20:01:28 GMT-0600 (CST)');
    }

    static typeEndDate(): promise.Promise<void> {
        this.highlightElement(by.id('endDate'));
        return element(by.id('endDate')).sendKeys('Sun May 27 1984 04:32:13 GMT-0500 (CDT)');
    }

    static typeFrequency(): promise.Promise<void> {
        this.highlightElement(by.id('frequency'));
        return element(by.id('frequency')).sendKeys('Everyday');
    }

    static typeGoalDescription(): promise.Promise<void> {
        this.highlightElement(by.id('description'));
        return element(by.id('description')).sendKeys('Test goals so that we get a good grade in testing');
    }

    static clickConfirmAddGoalButton(): promise.Promise<void> {
        this.highlightElement(by.id('confirmAddGoalButton'));
        return element(by.id('confirmAddGoalButton')).click();
    }
}
