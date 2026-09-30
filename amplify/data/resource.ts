import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
  AWS Amplify Gen 2 Data Resource (DynamoDB + AppSync GraphQL)
  Define schemas for Personal Finance records: Transactions and Budgets.
  Each record is isolated per authenticated Cognito User (allow.owner()).
*/

const schema = a.schema({
  Transaction: a
    .model({
      description: a.string().required(),
      amount: a.float().required(),
      type: a.string().required(), // 'income' | 'expense'
      category: a.string().required(),
      date: a.date().required(),
      paymentMethod: a.string(),
      notes: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  Budget: a
    .model({
      category: a.string().required(),
      monthlyLimit: a.float().required(),
    })
    .authorization((allow) => [allow.owner()]),

  FinancialGoal: a
    .model({
      title: a.string().required(),
      targetAmount: a.float().required(),
      currentAmount: a.float().required(),
      deadline: a.date(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
