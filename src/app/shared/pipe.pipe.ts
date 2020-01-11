import { Pipe, PipeTransform, EventEmitter, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()


@Pipe({
  name: 'pipe'
})
export class PipePipe implements PipeTransform {
  public static val: any;

  static items: any;
  static filter: any;
  static defaultFilter: boolean;

  public transform(items: any, filter: any): any {
    const defaultFilter = null;
    // console.log(items, filter, defaultFilter);

    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }

    if (filter && Array.isArray(items)) {
      const filterKeys = Object.keys(filter);
      if (defaultFilter) {
        console.log('items.filterKeys', filter);
        return items.filter(item =>
          filterKeys.reduce((x, keyName) =>
            (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === '', true));
      } else {
        PipePipe.val = [];
        PipePipe.val = items.filter(item => {
          return filterKeys.some((keyName) => {
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === '';
          });
        });
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === '';
          });
        });
      }
    }
  }
}
