import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "~/server/db";
import { collections, users } from "~/server/db/schema";

/**
 * Cached function to get a user by their Clerk ID
 *
 * @param clerk_id - The Clerk ID of the user to find
 * @returns The user object if found, null otherwise
 * @cache Cached for 1 hour with 'users' tag
 */
export const get_user_by_id_cache = unstable_cache(
  async (clerk_id: string) => {
    return await db.query.users.findFirst({
      where: eq(users.clerk_id, clerk_id),
    });
  },
  ["users"],
  {
    tags: ["users"],
    revalidate: 3600,
  },
);

/**
 * Cached function to get a user by their Stripe customer ID
 *
 * @param customer_id - The Stripe customer ID of the user to find
 * @returns The user object if found, null otherwise
 * @cache Cached for 1 hour with 'users' tag
 */
export const get_user_by_customer_id_cache = unstable_cache(
  async (customer_id: string) => {
    return await db.query.users.findFirst({
      where: eq(users.customer_id, customer_id),
    });
  },
  ["users"],
  {
    tags: ["users"],
    revalidate: 3600,
  },
);

/**
 * Cached function to get a collection by its ID
 *
 * @param collection_id - The ID of the collection to find
 * @returns The collection object if found, null otherwise
 * @cache Cached for 1 hour with 'collections' tag
 */
export const get_collection_by_id = unstable_cache(
  async (collection_id: string) => {
    return await db.query.collections.findFirst({
      where: eq(collections.id, collection_id),
    });
  },
  ["collections_id"],
  {
    tags: ["collections"],
    revalidate: 3600,
  },
);
