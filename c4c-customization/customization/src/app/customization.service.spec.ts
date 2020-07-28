import { TestBed } from '@angular/core/testing';

import { CustomizationService } from './customization.service';

describe('CustomizationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomizationService = TestBed.get(CustomizationService);
    expect(service).toBeTruthy();
  });
});
