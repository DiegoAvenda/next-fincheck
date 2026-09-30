import { defineAuth } from '@aws-amplify/backend';

/*
  AWS Amplify Gen 2 Auth Resource (Amazon Cognito)
  Configured for Email and Password authentication.
*/

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
  },
});
