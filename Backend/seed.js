const fetch = global.fetch || require('node-fetch');

const BASE_URL = 'http://localhost:4000';

const users = [
  { firstName: 'Alice', lastName: 'Khan', email: 'alice@example.com', password: 'Password1!', amount: 100000 },
  { firstName: 'Bob', lastName: 'Ahmed', email: 'bob@example.com', password: 'Password1!', amount: 120000 },
  { firstName: 'Charlie', lastName: 'Iqbal', email: 'charlie@example.com', password: 'Password1!', amount: 80000 },
  { firstName: 'Diana', lastName: 'Raza', email: 'diana@example.com', password: 'Password1!', amount: 90000 },
  { firstName: 'Ethan', lastName: 'Ali', email: 'ethan@example.com', password: 'Password1!', amount: 110000 },
  { firstName: 'Fatima', lastName: 'Noor', email: 'fatima@example.com', password: 'Password1!', amount: 95000 },
  { firstName: 'George', lastName: 'Shah', email: 'george@example.com', password: 'Password1!', amount: 105000 },
  { firstName: 'Hina', lastName: 'Zafar', email: 'hina@example.com', password: 'Password1!', amount: 98000 },
  { firstName: 'Imran', lastName: 'Malik', email: 'imran@example.com', password: 'Password1!', amount: 102000 },
  { firstName: 'Javeria', lastName: 'Ansari', email: 'javeria@example.com', password: 'Password1!', amount: 115000 },
];

const expenses = [
  { transactionName: 'Groceries', price: 5500, date: '2026-02-01' },
  { transactionName: 'Electricity Bill', price: 4200, date: '2026-02-03' },
  { transactionName: 'Internet', price: 2500, date: '2026-02-05' },
  { transactionName: 'Fuel', price: 6000, date: '2026-02-07' },
  { transactionName: 'Dining Out', price: 3200, date: '2026-02-09' },
  { transactionName: 'Clothing', price: 7800, date: '2026-02-11' },
  { transactionName: 'Gym Membership', price: 3000, date: '2026-02-13' },
  { transactionName: 'Streaming Subscriptions', price: 1800, date: '2026-02-15' },
  { transactionName: 'Mobile Recharge', price: 1500, date: '2026-02-17' },
  { transactionName: 'Medical', price: 9000, date: '2026-02-19' },
];

async function signupUser(u) {
  const res = await fetch(`${BASE_URL}/api/users/SignUp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(u),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to sign up ${u.email}:`, res.status, text);
    return null;
  }

  const data = await res.json();
  console.log(`Signed up user: ${data.email || u.email}`);
  return data.token;
}

async function addExpense(token, exp) {
  const res = await fetch(`${BASE_URL}/api/expenses/add-budget`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(exp),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to add expense "${exp.transactionName}":`, res.status, text);
    return;
  }

  console.log(`Added expense: ${exp.transactionName}`);
}

async function main() {
  try {
    console.log('Seeding 10 users...');
    const tokens = [];
    for (const u of users) {
      const token = await signupUser(u);
      if (token) tokens.push(token);
    }

    if (!tokens.length) {
      console.error('No users created successfully, aborting expenses seeding.');
      process.exit(1);
    }

    const tokenForExpenses = tokens[0];

    console.log('Seeding 10 expenses for first user...');
    for (const e of expenses) {
      await addExpense(tokenForExpenses, e);
    }

    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

main();

