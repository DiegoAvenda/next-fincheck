import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/*
  AWS Amplify Gen 2 Backend Definition
  Binds Cognito Authentication and DynamoDB GraphQL Data.
*/

export const backend = defineBackend({
  auth,
  data,
});
