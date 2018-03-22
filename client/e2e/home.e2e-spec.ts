import {HomePage} from './home.po';
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
    let page: HomePage;

    beforeEach(() => {
        page = new HomePage();
    });


    it('should type something in filter name box and add an entry', () => {
        HomePage.navigateTo();
        HomePage.typeAName('Jubair');
        expect(element(by.id('3emoji')).isPresent()).toBeTruthy(); //check that the correct emoji is displayed
        page.clickSubmitButton();

    });

    it("should type a name and then move the slider positively and click submit. It then navigates to to the report page, clicks the owner box, and filters by roch and check if the first element is equal to roch", () => {
        HomePage.navigateTo();
        HomePage.typeAName('Roch');
        HomePage.selectTheSlider();
        HomePage.SlideTheSliderUp();
        HomePage.SlideTheSliderUp();
        expect(element(by.id('5emoji')).isPresent()).toBeTruthy(); //check that the correct emoji is displayed
        page.clickSubmitButton();
        HomePage.navigateToReports();
        HomePage.filterOwner('Roch');

        expect(page.getUniqueOwner()).toContain('Roch');

    });

    it("should type a name and then move the slider positively and negatiely and click submit", () => {
        HomePage.navigateTo();
        HomePage.typeAName('Andy');
        HomePage.selectTheSlider();
        HomePage.SlideTheSliderUp();
        HomePage.SlideTheSliderUp();
        HomePage.SlideTheSliderDown();
        HomePage.SlideTheSliderDown();
        HomePage.SlideTheSliderDown();
        HomePage.SlideTheSliderDown();
        HomePage.SlideTheSliderDown();
        expect(element(by.id('1emoji')).isPresent()).toBeTruthy(); //check that the correct emoji is displayed
        page.clickSubmitButton();
        HomePage.navigateToReports();
        HomePage.filterOwner('Andy');

        expect(page.getUniqueOwner()).toContain('Andy');
    });

    it('should make sure that each nav-bar item exists and then clicks each ', () => {
        browser.driver.manage().window().maximize(); //makes E2E test window fullscreen :)
        HomePage.navigateTo();
        page.journalButtonExists();
        page.clickJournalButton();
        HomePage.navigateTo();
        page.resourceButtonExists();
        page.clickResourceButton();
        HomePage.navigateTo();
        page.reportButtonExists();
        page.clickReportButton();
        HomePage.navigateTo();
        page.goalButtonExists();
        page.clickGoalButton();
        HomePage.navigateTo();
        page.crisisButtonExists();
        page.clickCrisisButton();
    });

});
