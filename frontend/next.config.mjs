/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://localhost:8080";
    const normalized = backend.endsWith("/") ? backend.slice(0, -1) : backend;
    return [
      {
        source: "/api/:path*",
        destination: `${normalized}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
