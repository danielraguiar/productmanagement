/**
 * Base service providing common CRUD operations
 * @template T The entity type
 */
export abstract class BaseService<T> {
  protected abstract endpoint: string;

  /**
   * Creates a new entity
   * @param entity The entity to create
   * @returns Observable of the created entity
   */
  create(entity: T): Observable<T> {
    return this.http.post<T>(this.endpoint, entity);
  }

  /**
   * Updates an existing entity
   * @param id The entity ID
   * @param entity The updated entity data
   * @returns Observable of the updated entity
   */
  update(id: number, entity: T): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${id}`, entity);
  }

} 