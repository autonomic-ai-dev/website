import type { LayoutServerLoad } from './$types';
import { getAutonomicFormulae } from '$lib/server/formula';

export const load: LayoutServerLoad = async () => {
	const formulae = await getAutonomicFormulae();
	return {
		autonomicVersion: formulae.ecosystemVersion,
		stackVersion: formulae.stackVersion,
		ecosystemVersion: formulae.ecosystemVersion,
		organVersions: formulae.organs
	};
};
