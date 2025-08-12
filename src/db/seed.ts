import { stripeClient } from '@/config/stripe';
import { auth } from '@/lib/auth';
import { createFeedback } from '@/services/feedback';
import { createOrder } from '@/services/order';
import type { Product } from '@/types/product';
import type { User } from '@/types/user';
import { TAX_RATE } from '@/utils/calcTax';
import { tryCatch } from '@/utils/tryCatch';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { db } from '.';
import * as schema from './schema';

const COUNTS = {
  users: 10, // total users
  products: 5, // per user
  orders: 2, // per product
  feedbacks: 2, // per product
};

const createUser = async (index: number) => {
  const [userError, createdUser] = await tryCatch(
    auth.api.createUser({
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email({ firstName: `test${index}` }),
        password: '123456aA',
        // @ts-ignore
        role: faker.helpers.arrayElement(['chef', 'user']),
        data: {
          phone: faker.phone.number(),
          emailVerified: faker.datatype.boolean(),
          image: faker.image.avatar(),
          banned: faker.datatype.boolean(),
          bannedReason: faker.lorem.sentence(),
        },
      },
    }),
  );

  if (userError) throw userError;
  console.log(`User created: ${createdUser.user.name} (${createdUser.user.email})`);
  return createdUser.user;
};

const fetchUser = async (userId: string) => {
  const [userFetchError, user] = await tryCatch(
    db.query.user.findFirst({
      where: eq(schema.user.id, userId),
    }),
  );

  if (userFetchError) throw userFetchError;
  if (!user) throw new Error('User not found');
  return user;
};

const createStripeCustomer = async (user: User) => {
  const [customerError, customer] = await tryCatch(
    stripeClient.customers.create({
      name: user.name,
      email: user.email,
      metadata: {
        userId: user.id,
        phone: user.phone,
      },
    }),
  );

  if (customerError) throw customerError;

  console.log(`Customer created: ${customer.id}`);

  return customer.id;
};

const updateUserWithStripeCustomerId = async (userId: string, customerId: string) => {
  const [updateUserError] = await tryCatch(
    db.update(schema.user).set({ stripeCustomerId: customerId }).where(eq(schema.user.id, userId)),
  );

  if (updateUserError) throw updateUserError;
  console.log(`User updated: ${userId}`);
};

const createProductTest = async (userId: string) => {
  const [createProductError, createdProduct] = await tryCatch(
    db
      .insert(schema.product)
      .values({
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price({ min: 30, max: 1000, dec: 2 })),
        description: faker.lorem.sentence(),
        featured: faker.datatype.boolean(),
        images: [faker.image.url(), faker.image.url()],
        status: faker.helpers.arrayElement(['active', 'inactive', 'pending', 'rejected']),
        userId,
      })
      .returning(),
  );

  if (createProductError) throw createProductError;

  const product = createdProduct[0];

  console.log(`Product created: ${product.name} (${product.id})`);
  await delay(1000);

  return product;
};

const createOrderTest = async (userId: string, product: Product) => {
  const quantity = faker.number.int({ min: 1, max: 10 });

  const [orderError] = await tryCatch(
    createOrder({
      productId: product.id,
      quantity,
      tax: TAX_RATE,
      total: product.price * quantity,
      status: faker.helpers.arrayElement(['pending', 'shipped', 'paid', 'cancelled']),
      userId,
      address: faker.location.streetAddress(),
      createdAt: faker.date.recent({ days: 90 }),
    }),
  );

  if (orderError) throw orderError;

  console.log(`Order created: ${product.name} (${product.id})`);
  await delay(1000); // Delay after Stripe checkout creation
};

const createCustomUsers = async () => {
  await auth.api.createUser({
    body: {
      name: 'Techno Zone - Admin',
      email: 'technozone019@gmail.com',
      password: '123456aA',
      role: 'admin',
      data: {
        phone: faker.phone.number(),
        emailVerified: true,
        image: faker.image.avatar(),
      },
    },
  });
  console.log('Admin user created: Techno Zone - Admin (technozone019@gmail.com)');
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUsers = async (index: number) => {
  const createdUser = await createUser(index);
  const user = await fetchUser(createdUser.id);
  const customerId = await createStripeCustomer(user);
  await updateUserWithStripeCustomerId(user.id, customerId);
  await delay(1000); // Delay after Stripe customer creation

  return user;
};

const createProducts = async (user: User) => {
  const products: Product[] = [];
  for (let i = 0; i < COUNTS.products; i++) {
    const product = await createProductTest(user.id);
    await delay(1000);
    products.push(product);
  }

  return products;
};

const createOrders = async (user: User, products: Product[]) => {
  for (let i = 0; i < COUNTS.orders; i++) {
    const product = faker.helpers.arrayElement(products);
    await createOrderTest(user.id, product);
    await delay(1000);
  }
};

const createFeedbacks = async (products: Product[]) => {
  await Promise.all(
    products.map(async (product) => {
      await createFeedback({
        comment: faker.lorem.sentence(),
        rating: faker.number.int({ min: 1, max: 5 }),
        productId: product.id,
        userId: product.userId,
      });
    }),
  );
};

const [users] = await Promise.all([
  await Promise.all(
    Array.from({ length: COUNTS.users }, async (_, i) => {
      const createdUser = await createUsers(i);
      await delay(1000); // Delay after user creation
      console.log(`User ${i + 1} created`);
      return createdUser;
    }),
  ),
  createCustomUsers(),
]);

const usersByRole = Object.groupBy(users, (user) =>
  user.role === 'user' ? 'users' : user.role === 'chef' ? 'chefs' : 'admins',
);

let products: Product[][] = [];
if (usersByRole.chefs) {
  const productsPromises = usersByRole.chefs.map(async (user) => {
    const productsForUser = await createProducts(user);
    console.log(`Products created for user ${user.id}`);
    await delay(1000); // Delay after product creation
    return productsForUser;
  });

  products = await Promise.all(productsPromises);
}

if (usersByRole.users) {
  await Promise.all(
    usersByRole.users.map(async (user) => {
      await createOrders(user, products.flat());
      console.log(`Orders created for user ${user.id}`);

      await delay(1000); // Delay after order creation
      await createFeedbacks(products.flat());
      console.log(`Feedbacks created for user ${user.id}`);
    }),
  );
}
