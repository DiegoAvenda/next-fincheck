'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

// Configure Amplify once on the client side with ssr: true so cookies are transmitted to the Next.js server
try {
  Amplify.configure(outputs, { ssr: true });
} catch (e) {
  console.warn('Amplify client-side configuration warning:', e);
}

export default function ConfigureAmplifyClientSide() {
  return null;
}
