import { clerkClient } from "@clerk/nextjs/server";
import { stripe } from ".";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function create_stripe_customer(user_id: string) {
  const clerk_client = await clerkClient();
  const user = await clerk_client.users.getUser(user_id);

  const customer = await stripe.customers.create({
    name: user.firstName + " " + user.lastName,
    email: user.emailAddresses[0]?.emailAddress,
  });

  await db
    .update(users)
    .set({ customer_id: customer.id })
    .where(eq(users.clerk_id, user_id));

  return customer;
}
