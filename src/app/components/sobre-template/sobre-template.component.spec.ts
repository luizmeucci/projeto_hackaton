import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreTemplateComponent } from './sobre-template.component';

describe('SobreTemplateComponent', () => {
  let component: SobreTemplateComponent;
  let fixture: ComponentFixture<SobreTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SobreTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SobreTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
