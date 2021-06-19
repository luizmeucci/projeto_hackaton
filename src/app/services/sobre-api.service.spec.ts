import { TestBed } from '@angular/core/testing';

import { SobreApiService } from './sobre-api.service';

describe('SobreApiService', () => {
  let service: SobreApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SobreApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
