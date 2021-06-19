import { TestBed } from '@angular/core/testing';

import { AjudaApiService } from './ajuda-api.service';

describe('AjudaApiService', () => {
  let service: AjudaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AjudaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
