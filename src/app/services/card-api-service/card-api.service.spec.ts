import { TestBed } from '@angular/core/testing';

import { CardApiService } from './card-api.service';

describe('CardApiService', () => {
   beforeEach(() => TestBed.configureTestingModule({}));

   it('should be created', () => {
      const service: CardApiService = TestBed.get(CardApiService);
      expect(service).toBeTruthy();
   });
});
