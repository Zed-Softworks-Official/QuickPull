import { unstable_cache } from "next/cache";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  create_checkout_session,
  create_portal_session,
} from "~/server/payments";
import { get_user_by_id_cache } from "~/server/db/query";

const create_checkout_session_cache = unstable_cache(
  async (user_id: string) => {
    return await create_checkout_session(user_id);
  },
  ["checkout"],
  {
    revalidate: 3600,
    tags: ["checkout"],
  },
);

const create_portal_session_cache = unstable_cache(
  async (customer_id: string) => {
    return await create_portal_session(customer_id);
  },
  ["portal"],
  {
    revalidate: 3600,
    tags: ["portal"],
  },
);

export const paymentsRouter = createTRPCRouter({
  create_checkout_session: protectedProcedure.query(async ({ ctx }) => {
    const db_user = await get_user_by_id_cache(ctx.user.id);
    if (db_user?.account_type === "premium") return { url: null };

    return await create_checkout_session_cache(ctx.user.id);
  }),

  create_portal_session: protectedProcedure.query(async ({ ctx }) => {
    const db_user = await get_user_by_id_cache(ctx.user.id);
    if (!db_user?.customer_id) return { url: null };

    return await create_portal_session_cache(db_user.customer_id);
  }),
});
