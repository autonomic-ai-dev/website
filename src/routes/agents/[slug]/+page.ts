import { error } from '@sveltejs/kit';
import { agents } from '$lib/data/agents';

export function load({ params }) {
  const agent = agents.find((a) => a.id === params.slug);

  if (!agent) {
    throw error(404, 'Agent not found');
  }

  return {
    agent
  };
}
