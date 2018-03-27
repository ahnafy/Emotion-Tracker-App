import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import {AddGoalComponent} from './add-goals.component';
import {CustomModule} from '../custom.module';

describe('Add goals component', () => {

    let addGoalComponent: AddGoalComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<AddGoalComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [AddGoalComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: null },
                { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }]
        }).compileComponents().catch(error => {
            expect(error).toBeNull();
        });
    }));

    beforeEach(() => {
        calledClose = false;
        fixture = TestBed.createComponent(AddGoalComponent);
        addGoalComponent = fixture.componentInstance;
    });

    it('closes properly', () => {
        addGoalComponent.onNoClick();
        expect(calledClose).toBe(true);
    });
});
