import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { ERROR_MESSAGES } from '../constants/error-messages.constants';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string> {
  constructor(private readonly version: '3' | '4' | '5' | 'all' = '4') {}

  transform(value: string): string {
    if (!isUUID(value, this.version)) {
      throw new BadRequestException(ERROR_MESSAGES.VALIDATION_ERROR, `El valor proporcionado (${value}) no es un UUID válido`);
    }
    return value;
  }
}
