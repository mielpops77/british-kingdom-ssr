import { TestBed } from '@angular/core/testing';

import { ChatonsService } from './chatons.service';

describe('ChatonsService', () => {
  let service: ChatonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
