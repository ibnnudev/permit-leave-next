interface QueryParams {
  page?: number;
  limit?: number;
  filter?: string;
  search?: string;
  order_by?: string;
  sorted_by?: "asc" | "desc";
  with?: string;
}

type ApiParams = {
  filter?: Record<string, any>;
  search?: string;
  order_by?: string;
  sorted_by?: "asc" | "desc";
  pagination?: {
    page: number;
    limit: number;
  };
  with?: string;
};

export function buildApiQuery(params: ApiParams): Record<string, any> {
  const {
    filter,
    search,
    order_by,
    sorted_by,
    pagination,
    with: withParams,
  } = params;

  const query: Record<string, any> = {};

  if (search) {
    query.where = query.where || {};
    query.where.OR = query.where.OR || [];

    const searchFields = search.split(":");

    // Jika search memiliki format relasi.field:value
    if (searchFields.length === 2) {
      const [relationField, value] = searchFields;
      const [relation, field] = relationField.split(".");

      if (relation && field && value) {
        // Handle relasi (misal: user.nama)
        query.where.OR.push({
          [relation]: {
            [field]: { contains: value.replace(/"/g, "") }, // Tanpa mode: "insensitive"
          },
        });
      } else if (relationField && value) {
        // Handle field langsung (misal: resume:"...")
        query.where.OR.push({
          [relationField]: { contains: value.replace(/"/g, "") }, // Tanpa mode: "insensitive"
        });
      }
    } else {
      // Jika search hanya memiliki format field:value
      query.where.OR.push({
        nama: {
          contains: search.replace(/"/g, ""), // Pencarian default pada nama
        },
      });
      query.where.OR.push({
        deskripsi: {
          contains: search.replace(/"/g, ""), // Pencarian default pada deskripsi
        },
      });
    }
  }

  if (filter) {
    query.where = query.where || {};

    const setNestedFilter = (target: any, path: string, value: any) => {
      const keys = path.split(".");
      let current = target;

      keys.forEach((key, index) => {
        if (!current[key]) {
          current[key] = index === keys.length - 1 ? value : {};
        }
        current = current[key];
      });
    };

    Object.entries(filter).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        // Handle nested filters (e.g., user.pendidikan.some.gelar)
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          setNestedFilter(query.where, `${key}.${nestedKey}`, nestedValue);
        });
      } else if (Array.isArray(value)) {
        // Multiple values (e.g., negara: { in: ["Indonesia", "Jepang"] })
        setNestedFilter(query.where, key, {
          in: value,
        });
      } else {
        // Simple filter
        setNestedFilter(query.where, key, value);
      }
    });
  }

  query.where = query.where || {};

  // Handle ordering
  if (order_by) {
    query.orderBy = { [order_by]: sorted_by || "asc" };
  }

  // Handle pagination
  if (pagination && pagination.page && pagination.limit) {
    query.skip = (pagination.page - 1) * pagination.limit;
    query.take = pagination.limit;
  }
  if (withParams && withParams.length > 0) {
    query.include = {};

    withParams.split(",").forEach((relation) => {
      const parts = relation.split(".");
      let currentLevel = query.include;

      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }

        if (index === parts.length - 1) {
          currentLevel[part] = {
            include: {},
          };
        } else {
          if (!currentLevel[part].include) {
            currentLevel[part].include = {};
          }
          currentLevel = currentLevel[part].include;
        }
      });
    });
  }

  query.where = {
    ...query.where,
  };

  return query;
}
