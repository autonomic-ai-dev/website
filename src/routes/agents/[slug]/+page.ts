import { error } from '@sveltejs/kit';
import { agents } from '$lib/data/agents';

export async function load({ params, parent }) {
  const parentData = await parent();
  const rawAgent = agents.find((a) => a.id === params.slug);

  if (!rawAgent) {
    throw error(404, 'Agent not found');
  }

  const dynamicVersion = parentData.organVersions?.[rawAgent.name] || rawAgent.version;
  const agent = {
    ...rawAgent,
    version: dynamicVersion
  };

  return {
    agent
  };
}

