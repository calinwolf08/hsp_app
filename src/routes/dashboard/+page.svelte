<script lang="ts">
	import type { PageData } from './$types';
	import DashboardOverview from '$lib/features/lms/dashboard/components/DashboardOverview.svelte';
	import { dashboardCopy } from '$lib/features/lms/dashboard/dashboard-copy';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{dashboardCopy.page.title}</title>
	<meta name="description" content={dashboardCopy.page.description} />
</svelte:head>

<div class="container mx-auto px-4 py-8" data-testid="dashboard-page">
	<div class="mb-8">
		<h1 class="text-4xl font-bold text-blue" data-testid="page-title">
			{dashboardCopy.page.title}
		</h1>
		<p class="mt-2 text-gray-600" data-testid="page-description">
			{dashboardCopy.page.description}
		</p>
	</div>

	{#if data.error}
		<div
			class="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
			data-testid="error-state"
		>
			<p class="text-lg font-semibold text-red-900">
				{dashboardCopy.errors.loadingFailed.title}
			</p>
			<p class="mt-2 text-sm text-red-700">
				{data.error}
			</p>
		</div>
	{/if}

	<DashboardOverview data={data.dashboardData} />
</div>
