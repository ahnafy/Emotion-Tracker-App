import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {resources} from './resources';
import {ResourcesComponent} from './resources.component';
import {ResourcesService} from './resources.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Resource list', () => {

    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>
    };

    beforeEach(() => {
        // stub ResourceService for test purposes
        resourceListServiceStub = {
            getResources: () => Observable.of([
                {
                    _id: '5ab2bc3742f5a7b6f0f48626',
                    name: 'Robert Ward',
                    email: 'Ladonna@ Benson.com',
                    phone: '(891) 411-3124',

                },
                {
                    _id: '5ab2bc37bc8681f8f0ddf797',
                    name: 'Thomas Franco',
                    email: 'Lila@ Browning.com',
                    phone: '(803) 525-2495',
                },
                {
                    _id: '5ab2bc370290adc56f8065fc',
                    name: 'Wood Aguirre',
                    email: 'Alford@ Beard.com',
                    phone: '(862) 433-3136',
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ResourcesComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: ResourcesService, useValue: resourceListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the resources', () => {
        expect(resourceList.resources.length).toBe(3);
    });

    it('contains a resource with name \'Robert Ward\'', () => {
        expect(resourceList.resources.some((resource: resources) => resource.name === 'Robert Ward')).toBe(true);
    });

    it('doesn\'t contain a user named \'Santa\'', () => {
        expect(resourceList.resources.some((resource: resources) => resource.name === 'Santa')).toBe(false);
    });

    it('has two resources with email', () => {
        expect(resourceList.resources.filter((resource: resources) => resource.email === 'Ladonna@ Benson.com').length).toBe(1);
    });

    it('resource list filters by name', () => {
        expect(resourceList.filteredResources.length).toBe(3);
        resourceList.resourcesName = 'T';
        resourceList.refreshResources().subscribe(() => {
            expect(resourceList.filteredResources.length).toBe(2);
        });
    });

});

describe('Misbehaving Resource List', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        resourceListServiceStub = {
            getResources: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ResourcesComponent],
            providers: [{provide: ResourcesService, useValue: resourceListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a ResourceListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(resourceList.resources).toBeUndefined();
    });
});


describe('Adding a resource', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const newResource: resources = {
        _id: '5ab2bc37e194ff1f2434eb46',
        name: 'test man',
        email: "fefwaefjj@gsfewf.com",
        phone: "1715611615161"
    };
    const newId = 'new_id';

    let calledResource: resources;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>,
        addNewResource: (newResource: resources) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddResourceComponent, any) => {
            afterClosed: () => Observable<resources>
        };
    };

    beforeEach(() => {
        calledResource = null;
        // stub ResourceService for test purposes
        resourceListServiceStub = {
            getResources: () => Observable.of([]),
            addNewResource: (resourceToAdd: resources) => {
                calledResource = resourceToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newResource);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ResourcesComponent],
            providers: [
                {provide: ResourcesService, useValue: resourceListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

/**
     it('calls ResourcesService.addResource', () => {
        expect(calledResource).toBeNull();
        resourceList.openDialog();
        expect(calledResource).toEqual(newResource);
    });
**/
});
