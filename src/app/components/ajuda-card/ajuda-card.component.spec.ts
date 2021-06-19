import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjudaCardComponent } from './ajuda-card.component';

describe('AjudaCardComponent', () => {
  let component: AjudaCardComponent;
  let fixture: ComponentFixture<AjudaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjudaCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjudaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
