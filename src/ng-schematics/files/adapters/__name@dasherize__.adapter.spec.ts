import { TestBed } from '@angular/core/testing';
import { <%= classify(name) %>Adapter } from './<%= dasherize(name) %>.adapter';

describe('<%= classify(name) %>Adapter', () => {
  let adapter: <%= classify(name) %>Adapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    adapter = TestBed.inject(<%= classify(name) %>Adapter);
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });
});