import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from '@angular/core/testing';

describe('Calculator Service test', () => {
  let calculatorService: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy}
      ]
    });
    calculatorService = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    const result = calculatorService.add(2, 2);
    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalled();
  });

  it('should subtract two numbers', () => {
    const result = calculatorService.subtract(2, 2);
    expect(result).toBe(0);
    expect(loggerSpy.log).toHaveBeenCalled();
  });
});
