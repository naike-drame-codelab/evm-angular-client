import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: Date | string | number | null | undefined): string {
    if (!value) {
      return 'N/A'; // Or return a default value like 'N/A'
    }
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Invalid Time';
      }
      return date.toLocaleTimeString('fr-BE', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting time:", value, error);
      return 'Error';
    }
  }
}
