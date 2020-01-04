import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeListComponent } from './time-list.component';

describe('ListComponent', () => {
  let component: TimeListComponent;
  let fixture: ComponentFixture<TimeListComponent>;
  let panelExpanded = false;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
