import {GoalsPage} from './goals.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
    let args = arguments;

    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    // If you're tired of it taking long you can remove this call
    // origFn.call(browser.driver.controlFlow(), function () {
    //     return protractor.promise.delayed(100);
    // });

    return origFn.apply(browser.driver.controlFlow(), args);
};

describe('', () => {
    let page: GoalsPage;

    beforeEach(() => {
        page = new GoalsPage();
    });


    it('should check that a goal is on the page', () => {
        GoalsPage.navigateTo();
        GoalsPage.goalExists();
        GoalsPage.clickGoal();
    });

    it("should add a goal", () => {
        GoalsPage.navigateTo();
        GoalsPage.addGoalButtonExists();
        GoalsPage.clickAddGoalButton();
        GoalsPage.typeOwner();
        GoalsPage.typeGoalName();
        GoalsPage.typeCategory();
        GoalsPage.typeStartDate();
        GoalsPage.typeEndDate();
        GoalsPage.typeFrequency();
        GoalsPage.typeGoalDescription();
        GoalsPage.clickConfirmAddGoalButton();
    });

});
