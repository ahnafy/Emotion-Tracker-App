import {JournalPage} from './journal-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

describe('Journal list', () => {
    let page: JournalPage;

    beforeEach(() => {
        page = new JournalPage();
    });

    // For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final
    it('Should have an add journal button', () => {
        JournalPage.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });


    it('Should actually add the journal with the information we put in the fields', () => {
        JournalPage.navigateTo();
        page.clickAddJournalButton();
        element(by.id('subjectField')).sendKeys('Sad day');
        element(by.id('bodyField')).sendKeys('today was a sad day');

        element(by.id('confirmAddJournalButton')).click();
        // This annoying delay is necessary, otherwise it's possible that we execute the `expect`
        // line before the add user has been fully processed and the new user is available
        // in the list.
        // setTimeout(() => {
        //     //expect(page.getUniqueJournal('tracy@awesome.com')).toMatch('Tracy Kim.*'); // toEqual('Tracy Kim');
        // }, 10000);
    });

    it('Should allow us to put information into the fields of the add user dialog', () => {
        JournalPage.navigateTo();
        page.clickAddJournalButton();
        expect(element(by.id('subjectField')).isPresent()).toBeTruthy('There should be a subject field');
        element(by.id('subjectField')).sendKeys('sunday');
        expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be an body field');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('bodyField')).sendKeys('today was not a bad day');
        element(by.id('exitWithoutAddingButton')).click();
    });

    it('should get and highlight Journals title attribute ', () => {
        JournalPage.navigateTo();
        expect(page.getJournalTitle()).toEqual('Journals');
    });

    it('should type something in filter subject box and check that it returned correct element', () => {
        JournalPage.navigateTo();
        JournalPage.typeASubject('W');
        expect(page.getUniqueJournal('58af3a600343927e48e8722c')).toEqual('Wednesday');
        //JournalPage.backspace();
        //JournalPage.typeASubject("t");
        //expect(page.getUniqueJournal('58af3a600343927e48e87215')).toEqual('I listened to this great song today');
    });

});
