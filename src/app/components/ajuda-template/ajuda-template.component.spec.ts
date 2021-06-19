import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjudaTemplateComponent } from './ajuda-template.component';

describe('AjudaTemplateComponent', () => {
  let component: AjudaTemplateComponent;
  let fixture: ComponentFixture<AjudaTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjudaTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjudaTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
