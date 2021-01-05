import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C4cTaskComponent } from './c4c-task.component';

describe('C4cTaskComponent', () => {
  let component: C4cTaskComponent;
  let fixture: ComponentFixture<C4cTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C4cTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C4cTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
