// Mock data for Repository Detail page

interface TechnologyCategory {
  category: string;
  items: { name: string; version: string }[];
}

interface RepositoryDetail {
  id: string;
  name: string;
  fullName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  language: string;
  framework: string;
  database: string;
  authentication: string;
  linesOfCode: number;
  modules: number;
  services: number;
  apis: number;
  entities: number;
  technologyStack: TechnologyCategory[];
  repositoryStats: { label: string; value: string }[];
}

export const repositoryDetail: RepositoryDetail = {
  id: 'repo-1',
  name: 'commerce-platform',
  fullName: 'acme-corp/commerce-platform',
  description:
    'A full-featured e-commerce platform built with Next.js 14 featuring product catalog management, shopping cart, Stripe payments, user authentication, and real-time order tracking. Designed for high-traffic B2C and B2B commerce with headless API support and multi-tenant architecture.',
  createdAt: '2023-03-15T09:00:00Z',
  updatedAt: '2024-11-28T14:32:00Z',
  language: 'TypeScript',
  framework: 'Next.js 14',
  database: 'MongoDB',
  authentication: 'JWT',
  linesOfCode: 184732,
  modules: 12,
  services: 8,
  apis: 47,
  entities: 23,
  technologyStack: [
    {
      category: 'Frontend',
      items: [
        { name: 'Next.js', version: '14.1.0' },
        { name: 'React', version: '18.2.0' },
        { name: 'Tailwind CSS', version: '3.4.1' },
        { name: 'Framer Motion', version: '11.0.3' },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Node.js', version: '20.11.0' },
        { name: 'Express', version: '4.18.2' },
        { name: 'tRPC', version: '10.45.2' },
      ],
    },
    {
      category: 'Database',
      items: [
        { name: 'MongoDB', version: '7.0.4' },
        { name: 'Mongoose', version: '8.1.1' },
        { name: 'Redis', version: '7.2.4' },
      ],
    },
    {
      category: 'Infrastructure',
      items: [
        { name: 'Vercel', version: '33.0.0' },
        { name: 'Docker', version: '24.0.7' },
        { name: 'GitHub Actions', version: '—' },
      ],
    },
    {
      category: 'Authentication',
      items: [
        { name: 'JWT', version: '9.0.2' },
        { name: 'bcrypt', version: '5.1.1' },
        { name: 'NextAuth.js', version: '4.24.5' },
      ],
    },
    {
      category: 'Payments',
      items: [
        { name: 'Stripe', version: '14.14.0' },
        { name: 'Stripe Webhooks', version: '—' },
      ],
    },
    {
      category: 'Monitoring',
      items: [
        { name: 'Datadog', version: '4.9.0' },
        { name: 'Sentry', version: '7.100.1' },
      ],
    },
  ],
  repositoryStats: [
    { label: 'Description', value: 'Full-featured e-commerce platform with headless API' },
    { label: 'Created', value: 'March 15, 2023' },
    { label: 'Last Updated', value: 'November 28, 2024' },
    { label: 'Programming Language', value: 'TypeScript' },
    { label: 'Framework', value: 'Next.js 14' },
    { label: 'Modules', value: '12' },
    { label: 'Microservices', value: '8' },
    { label: 'API Endpoints', value: '47' },
    { label: 'Data Entities', value: '23' },
    { label: 'Lines of Code', value: '184,732' },
    { label: 'Database', value: 'MongoDB 7' },
    { label: 'Authentication', value: 'JWT + NextAuth.js' },
  ],
};