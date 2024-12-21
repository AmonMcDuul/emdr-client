import { TestBed } from '@angular/core/testing';

import { DistractService } from './distract.service';

describe('DistractService', () => {
  let service: DistractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
