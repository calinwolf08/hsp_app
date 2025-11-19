<script lang="ts">
	import type { DashboardStats } from '../types';
	import { dashboardCopy } from '../dashboard-copy';
	import ProgressCircle from '../../ui/ProgressCircle.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		stats: DashboardStats;
		loading?: boolean;
		class?: string;
	};

	let { stats, loading = false, class: className }: Props = $props();

	const statCards = [
		{
			key: 'totalEnrolled',
			value: stats.totalEnrolled,
			label: dashboardCopy.sections.stats.totalEnrolled.label,
			singular: dashboardCopy.sections.stats.totalEnrolled.singular,
			plural: dashboardCopy.sections.stats.totalEnrolled.plural,
			color: 'text-blue'
		},
		{
			key: 'inProgress',
			value: stats.inProgress,
			label: dashboardCopy.sections.stats.inProgress.label,
			singular: dashboardCopy.sections.stats.inProgress.singular,
			plural: dashboardCopy.sections.stats.inProgress.plural,
			color: 'text-light-orange'
		},
		{
			key: 'completed',
			value: stats.completed,
			label: dashboardCopy.sections.stats.completed.label,
			singular: dashboardCopy.sections.stats.completed.singular,
			plural: dashboardCopy.sections.stats.completed.plural,
			color: 'text-dark-green'
		},
		{
			key: 'notStarted',
			value: stats.notStarted,
			label: dashboardCopy.sections.stats.notStarted.label,
			singular: dashboardCopy.sections.stats.notStarted.singular,
			plural: dashboardCopy.sections.stats.notStarted.plural,
			color: 'text-gray-600'
		}
	];
</script>

<div class={cn('space-y-6', className)} data-testid="progress-summary">
	<h2 class="text-2xl font-bold text-blue" data-testid="progress-summary-title">
		{dashboardCopy.sections.stats.title}
	</h2>

	{#if loading}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="progress-summary-loading">
			{#each Array.from({ length: 4 }) as _}
				<div class="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
					<div class="h-4 w-24 rounded bg-gray-200"></div>
					<div class="mt-4 h-8 w-16 rounded bg-gray-200"></div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="progress-summary-stats">
			{#each statCards as stat}
				<div
					class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
					data-testid="stat-card-{stat.key}"
				>
					<p class="text-sm font-medium text-gray-600" data-testid="stat-label-{stat.key}">
						{stat.label}
					</p>
					<div class="mt-2 flex items-baseline gap-2">
						<p class={cn('text-3xl font-bold', stat.color)} data-testid="stat-value-{stat.key}">
							{stat.value}
						</p>
						<p class="text-sm text-gray-500" data-testid="stat-unit-{stat.key}">
							{stat.value === 1 ? stat.singular : stat.plural}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<div
			class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
			data-testid="overall-progress-card"
		>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600" data-testid="overall-progress-label">
						{dashboardCopy.sections.stats.overall.label}
					</p>
					<p class="mt-2 text-3xl font-bold text-blue" data-testid="overall-progress-value">
						{stats.overallCompletionPercentage}%
					</p>
				</div>
				<ProgressCircle
					percentage={stats.overallCompletionPercentage}
					size={120}
					showLabel={false}
				/>
			</div>
		</div>
	{/if}
</div>
