import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';


const apiUrl = environment.API_URL + '/basic/xml/';

@Injectable({ providedIn: 'root' })
export class SharedService {

  constructor(
    private http: HttpClient,
  ) { }

  private successMessage = 'Successfully Saved!';

  private secondsPatternValiation = '^(?:[0-9]|[1-5][0-9]|60)$';
  // private ipPatternValidation = '^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$'; // Previous IP pattern validation
  // tslint:disable-next-line:max-line-length
  // private ipPatternValidation = '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
  private numericDaysValidation = '[1-7]'; // validation for between 1- 7 only
  private minutesPatternValiation = '^(?:[1-9]|[1-5][1-9]|99)$';  // validation for min between 1-99 min
  private acceptOnlyWholeNumbers = '^[0-9]*$'; // accept all numbers including 0
  private acceptOnlyNaturalNumbers = '^(?:[1-9]|[1-9]\\d+)$'; // accept all numbers except 0 and preceeding with 0
  private ipPatternValidation = '^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.' + '([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.'
  + '([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.' + '([01]?\\d\\d?|2[0-4]\\d|25[0-5])$';
 private onlyNumber = '^[0-9]*$';   // only for input number.
 private alphaNumeric = '^[1-9A-Z]+'; // accept only numbers or alphabets or both
 private numbersAndLettersBoth = '^(?=.*?\\d)(?=.*?[A-Z])[A-Z\\d]+$';
 private commaSeparatedNumbers = '^\\d+(,\\d+)*$';

  public get getSecondsPatternValiation() {
    return this.secondsPatternValiation;
  }

  public get getIpPatternValidation() {
    return this.ipPatternValidation;
  }

  public get getSuccessMessage() {
    return this.successMessage;
  }

  public get getDaysPatternValidation() {
    return this.numericDaysValidation;
  }

  public get getAcceptOnlyNaturalNumbersValidation() {
    return this.acceptOnlyNaturalNumbers;
  }

  public get getAcceptOnlyWholeNumbersValidation() {
    return this.acceptOnlyWholeNumbers;
  }

  public get getMinPatternValidation() {
    return this.minutesPatternValiation;
  }

  public get getNumberValidation() {
    return this.onlyNumber;
  }

  public get getAlphaNumericValidation() {
    return this.alphaNumeric;
  }

  public get getNumbersAndLettersBothValidation() {
    return this.numbersAndLettersBoth;
  }

  public defaultLanguage() {
    return this.http.get<{ code: number; data: any; errorMessage: string; message: string }>(apiUrl + 'getUnmLanguageSelection');

    // return 1;
  }

  public get getCommaSeparatedNumbersValidation() {
    return this.commaSeparatedNumbers;
  }

}
