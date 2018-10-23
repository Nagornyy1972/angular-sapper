import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includeStr'
})
export class IncludeStrPipe implements PipeTransform {

  transform(array, value: string): any {
    if (array) {
      return array.filter( elem => {
        if (elem) {
        return (elem.game.toLowerCase().includes(value ===  undefined ? value : value.toLowerCase()));
        } else {
          return false;
        }
      });
    } else {
      return array;
    }
  }

}
