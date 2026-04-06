import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMain } from './chat-main';

describe('ChatMain', () => {
  let component: ChatMain;
  let fixture: ComponentFixture<ChatMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMain],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
