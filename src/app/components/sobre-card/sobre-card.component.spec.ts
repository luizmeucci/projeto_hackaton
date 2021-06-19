import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreCardComponent } from './sobre-card.component';

describe('SobreCardComponent', () => {
  let component: SobreCardComponent;
  let fixture: ComponentFixture<SobreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SobreCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SobreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
