import { TestBed } from '@angular/core/testing';

import { CandidateStatusServiceService } from './candidate-status-service.service';

describe('CandidateStatusServiceService', () => {
  let service: CandidateStatusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateStatusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
