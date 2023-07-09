import { DeepPartial } from 'typeorm';

export type NewEntity<T> = DeepPartial<T>;
