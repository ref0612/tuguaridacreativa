import { PipeTransform } from '@nestjs/common';
export declare class ParseUUIDPipe implements PipeTransform<string> {
    private readonly version;
    constructor(version?: '3' | '4' | '5' | 'all');
    transform(value: string): string;
}
