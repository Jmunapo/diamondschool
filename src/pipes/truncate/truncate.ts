import { Pipe } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, args: number) {
    let limit = args > 0 ? args : 100;
    let trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
