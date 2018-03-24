import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {ChartsComponent} from "./charts.component";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import {ReportsService} from "../reports/reports.service";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {Emoji} from "../emoji";

describe('Reports list', () => {

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
                    date: 'Fri Nov 17 2017 17:15:18 GMT+0000 (UTC)'
                },
                {
                    _id: '6w1er8bni17w87w9ery8',
                    owner: 'Roch',
                    mood: 4,
                    date: 'Mon Jul 17 2017 21:54:32 GMT+0000 (UTC)'
                },
                {
                    _id: '814aei77j8e698e4g89t',
                    owner: 'Leo',
                    mood: 5,
                    date: 'Sat Apr 22 2017 10:15:08 GMT+0000 (UTC)'
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

    it('has one emoji with the owner leo', () => {
        expect(emojiList.emojis.filter((emoji: Emoji) => emoji.owner === 'Leo').length).toBe(1);
    });

    it('chart filters by name', () => {
        console.log(emojiList.emojis)
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.emojiOwner = 'L';
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(1);
        });
    });

    it('chart filters by start date', () => {
        console.log(emojiList.emojis)
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.startDate = 'Mon Jul 17 2017 21:50:00 GMT+0000 (UTC)';
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(2);
        });
    });

    it('chart filters by end date', () => {
        console.log(emojiList.emojis)
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.endDate = 'Mon Jul 17 2017 21:50:00 GMT+0000 (UTC)';
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filteredEmojis.length).toBe(1);
        });
    });

    it('chart filters by day of week', () => {
        console.log(emojiList.emojis)
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filterChart('Mon', '')).toBe(1);
        });
    });

    it('chart filters by emotion', () => {
        console.log(emojiList.emojis)
        expect(emojiList.filteredEmojis.length).toBe(3);
        emojiList.refreshEmojis().subscribe(() => {
            expect(emojiList.filterChart('', '4')).toBe(1);
        });
    });

});

describe('Misbehaving Emoji List', () => {
    let emojiList: ChartsComponent;
    let fixture: ComponentFixture<ChartsComponent>;

    let emojiListServiceStub: {
        getEmojis: () => Observable<Emoji[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        emojiListServiceStub = {
            getEmojis: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ChartsComponent],
            providers: [{provide: ReportsService, useValue: emojiListServiceStub},
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

    it('generates an error if we don\'t set up a ReportsService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(emojiList.emojis).toBeUndefined();
    });
});



