import { readFileSync } from 'fs';

export const typeDefs = readFileSync(new URL('./schemas/schema.graphql', import.meta.url), 'utf8');
