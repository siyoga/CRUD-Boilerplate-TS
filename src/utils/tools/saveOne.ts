import { NewEntity } from 'utils/types/NewEntity';
import { Repository } from 'typeorm';

export async function saveOne<T extends { id: string }>(
  repository: Repository<T>,
  entity: NewEntity<T>,
): Promise<T> {
  return await repository.save(entity);
}
