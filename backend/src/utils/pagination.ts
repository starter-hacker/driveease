// FILE: backend/src/utils/pagination.ts

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationParams = (
  queryPage?: string | number,
  queryLimit?: string | number,
): PaginationParams => {
  const page = Math.max(1, parseInt(String(queryPage || '1'), 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(String(queryLimit || '10'), 10)),
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});
