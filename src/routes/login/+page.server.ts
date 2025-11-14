import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PageSlugs } from '$lib/constants';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If user is already logged in, redirect to home or redirectTo query param
	if (locals.session?.user) {
		const redirectTo = url.searchParams.get('redirectTo') || PageSlugs.home;
		throw redirect(302, redirectTo);
	}

	return {};
};
