import { z } from 'zod';
import { insertProductSchema, insertReviewSchema, products, reviews, cartItems, wallets } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  reviews: {
    list: {
      method: 'GET' as const,
      path: '/api/products/:productId/reviews',
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect & { user: any }>()), // Loose typing for user relation for now
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products/:productId/reviews',
      input: z.object({
        rating: z.number().min(1).max(5),
        comment: z.string(),
        imageUrl: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof reviews.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
  cart: {
    list: {
      method: 'GET' as const,
      path: '/api/cart',
      responses: {
        200: z.array(z.custom<typeof cartItems.$inferSelect & { product: typeof products.$inferSelect }>()),
        401: errorSchemas.unauthorized,
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/cart',
      input: z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      }),
      responses: {
        200: z.custom<typeof cartItems.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/cart/:id',
      input: z.object({
        quantity: z.number().min(0),
      }),
      responses: {
        200: z.custom<typeof cartItems.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    remove: {
      method: 'DELETE' as const,
      path: '/api/cart/:id',
      responses: {
        200: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    checkout: {
        method: 'POST' as const,
        path: '/api/cart/checkout',
        responses: {
            200: z.void(),
            400: z.object({ message: z.string() }), // Insufficient funds
            401: errorSchemas.unauthorized,
        }
    }
  },
  wallet: {
    get: {
      method: 'GET' as const,
      path: '/api/wallet',
      responses: {
        200: z.custom<typeof wallets.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    deposit: {
      method: 'POST' as const,
      path: '/api/wallet/deposit',
      input: z.object({
        amount: z.number().min(1), // in cents
      }),
      responses: {
        200: z.custom<typeof wallets.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
