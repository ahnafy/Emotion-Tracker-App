import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Goal} from './goals';
import {GoalsComponent} from './goals.component';
import {GoalsService} from './goals.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Goal list', () => {

    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    beforeEach(() => {
        // stub GoalService for test purposes
        goalListServiceStub = {
            getGoals: () => Observable.of([
                {
                    _id: 'john_id',
                    name: 'clean your room',
                    owner: 'John',
                    body: 'its dirty',
                    category: 'Todo',
                    startDate: '2 feb 1956',
                    endDate: '4 mar 1989',
                    frequency: 'once',
                    status: true
                },
                {
                    _id: 'chris_id',
                    name: 'Walk the dog',
                    owner: 'Cris',
                    body: 'hey walk the dog',
                    category: 'walk',
                    startDate: 'today',
                    endDate: 'forever',
                    frequency: 'everyday',
                    status: false
                },
                {
                    _id: 'enid_id',
                    name: 'Drink more water',
                    owner: 'Enid',
                    body: 'there ya go',
                    category: 'Todo',
                    startDate: '14 oct 1994',
                    endDate: '12 may 2013',
                    frequency: 'twice',
                    status: false
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [GoalsComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: GoalsService, useValue: goalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the goals', () => {
        expect(goalList.goals.length).toBe(3);
    });

    it('contains a goal with owner \'Cris\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.owner === 'Cris')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.owner === 'Santa')).toBe(false);
    });

    it('has two goals with category todo', () => {
        expect(goalList.goals.filter((goal: Goal) => goal.category === 'Todo').length).toBe(2);
    });

    it('goal list filters by owner', () => {
        expect(goalList.filteredGoals.length).toBe(3);
        goalList.goalOwner = 'J';
        goalList.refreshGoals().subscribe(() => {
            expect(goalList.filteredGoals.length).toBe(1);
        });
    });

});

describe('Misbehaving Goal List', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        goalListServiceStub = {
            getGoals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [{provide: GoalsService, useValue: goalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a GoalListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(goalList.goals).toBeUndefined();
    });
});


describe('Adding a goal', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const newGoal: Goal = {
        _id: 'new_id',
        name: 'make a goal',
        owner: 'New',
        body: 'need a goal',
        category: 'todo',
        startDate: 'tomorrow',
        endDate: 'next week',
        frequency: 'Once',
        status: false
    };
    const newId = 'new_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>,
        addNewGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddGoalComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        // stub GoalService for test purposes
        goalListServiceStub = {
            getGoals: () => Observable.of([]),
            addNewGoal: (goalToAdd: Goal) => {
                calledGoal = goalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newGoal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    /**
    it('calls GoalsService.addGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.openDialog();
        expect(calledGoal).toEqual(newGoal);
    });
     **/
});
