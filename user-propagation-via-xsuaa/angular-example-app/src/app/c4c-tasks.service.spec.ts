import { TestBed } from '@angular/core/testing';

import { C4cTasksService } from './c4c-tasks.service';

describe('C4cTasksService', () => {
  let service: C4cTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(C4cTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
