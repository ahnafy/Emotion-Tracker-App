
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {ChartsComponent} from "./charts.component";
import {Observable} from 'rxjs/Observable';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {ReportsService} from "../reports/reports.service";
import {Emoji} from "../emoji";

describe('Filtering for Charts', () => {

    let emojiList: ChartsComponent;
    let fixture: ComponentFixture<ChartsComponent>;

    let ReportsListServiceStub: {
        getEmojis: () => Observable<Emoji[]>
    };

    beforeEach(() => {
        // stub ReportsService for test purposes
        ReportsListServiceStub = {
            getEmojis: () => Observable.of([
                {
                    _id: '468ey161t98rry51te56',
                    owner: 'Nick',
                    mood: 3,
                    date: 'Sat Mar 24 2018 15:44:27 GMT-0500 (CDT)'
                },
                {
                    _id: '6w1er8bni17w87w9ery8',
                    owner: 'Roch',
                    mood: 4,
                    date: 'Fri Mar 23 2018 15:40:00 GMT-0500 (CDT)'
                },
                {
                    _id: '814aei77j8e698e4g89t',
                    owner: 'Leo',
                    mood: 5,
                    date: 'Wed Mar 21 2018 15:00:00 GMT-0500 (CDT)'
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ChartsComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: ReportsService, useValue: ReportsListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ChartsComponent);
            emojiList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the emojis', () => {
        expect(emojiList.emojis.length).toBe(3);
    });

    it('contains a owner named \'Nick\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.owner === 'Nick')).toBe(true);
    });

    it('contain a user named \'Roch\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.owner === 'Roch')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(emojiList.emojis.some((emoji: Emoji) => emoji.owner === 'Santa')).toBe(false);
    });

    it('has one emoji with the owner Leo', () => {
        expect(emojiList.emojis.filter((emoji: Emoji) => emoji.owner === 'Leo').length).toBe(1);
    });

    it('chart filters by name', () => {
        console.log(emojiList.emojis);
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.emojiOwner = 'L';
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(1);
        });
    });

    it('chart filters by start date', () => {
        console.log(emojiList.emojis);
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.startDate = new Date('Thu Mar 22 2018 15:45:00 GMT-0500 (CDT)');
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(2);
        });
    });

    it('chart filters by end date', () => {
        console.log(emojiList.emojis);
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.endDate = new Date('Thu Mar 22 2018 15:45:00 GMT-0500 (CDT)');
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(1);
        });
    });

    it('chart filters by day of week', () => {
        console.log(emojiList.emojis);
        emojiList.chartEmojis = emojiList.emojis;
        expect(emojiList.chartEmojis.length).toBe(3);
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filterChart('Sat', '')).toBe(1);
        });
    });

    it('chart filters by emotion', () => {
        console.log(emojiList.emojis);
        emojiList.chartEmojis = emojiList.emojis;
        expect(emojiList.chartEmojis.length).toBe(3);
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filterChart('', '4')).toBe(1);
        });
    });

});





