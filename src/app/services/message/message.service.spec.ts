import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should have an array of messages', () => {
    const messages = service.messages;

    expect(messages).toEqual([]);
  });

  describe('When the add method is called', () => {
    it('Should push a message to the messages array', () => {
      const message = 'test';
      const messages = service.messages;
      service.add(message);

      expect(messages).toContain(message);
    });
  });

  describe('When the clear method is called', () => {
    it('Should clear the messages array', () => {
      const messages = service.messages;
      service.clear();

      expect(messages).toEqual([]);
    });
  });
});
