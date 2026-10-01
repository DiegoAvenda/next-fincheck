import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import outputs from '@/amplify_outputs.json';

/*
  Official AWS Amplify Server Runner for Next.js App Router (SSR)
  Enables calling Amplify Auth (Cognito) and Data (AppSync / DynamoDB) 
  inside Server Components, Route Handlers, and Server Actions.
*/
export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});
