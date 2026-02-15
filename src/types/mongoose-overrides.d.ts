// Simplified overrides for mongoose Model methods to avoid complex union overloads
// caused by TypeScript strict mode and allow ergonomic use throughout the project.
// These declarations are intentionally broad but still typed to the generic T so
// callers do not need to provide explicit type arguments in most cases.

import 'mongoose';

declare module 'mongoose' {
  interface Model<T extends Document> {
    // return a Promise of T (or array)
    create(doc: DocumentDefinition<T> | DocumentDefinition<T>[]): Promise<T>;
    findById(id: any): Query<T | null, T>;
    find(filter?: any): Query<T[], T>;
    findOne(filter?: any): Query<T | null, T>;
    findByIdAndUpdate(id: any, update: any, options?: any): Query<T | null, T>;
    findByIdAndDelete(id: any, options?: any): Query<T | null, T>;
    deleteMany(filter?: any): Query<any, T>;
    findOneAndUpdate(
      filter: any,
      update: any,
      options?: any,
    ): Query<T | null, T>;
    updateMany(filter: any, update: any, options?: any): Query<any, T>;
    // add other commonly used methods if needed
  }
}
