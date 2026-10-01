import { generateClient } from 'aws-amplify/data';

/*
  Amplify Data Client (GraphQL / DynamoDB)
  For Client Components:
  Allows querying and mutating Transaction and Budget models:
  - client.models.Transaction.list()
  - client.models.Transaction.create({ ... })
  - client.models.Budget.list()
*/
export const client = generateClient();
