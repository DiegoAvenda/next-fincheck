/** @type {import('next').NextConfig} */
const nextConfig = {
  // The MongoDB driver loads native/optional dependencies at runtime, so it must
  // stay outside the server bundle.
  serverExternalPackages: ['mongodb'],
};

export default nextConfig;
