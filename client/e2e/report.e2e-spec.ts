import {ReportPage} from './report.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

describe('Report list', () => {
    let page: ReportPage;

    beforeEach(() => {
        page = new ReportPage();
    });

    // For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final


    it('should get and highlight Reports title attribute ', () => {
        ReportPage.navigateTo();
        expect(page.getReportsTitle()).toEqual('Reports');
    });

    it('should type something in filter subject box and check that it returned correct element', () => {
        ReportPage.navigateTo();
        ReportPage.typeAOwner('G');
        expect(page.getUniqueReport('5a98ab374e46b12e5ff8c60f')).toEqual('Gregory');
        //ReportPage.backspace();
        //ReportPage.typeASubject("t");
        //expect(page.getUniqueReport('58af3a600343927e48e87215')).toEqual('I listened to this great song today');
    });

});
