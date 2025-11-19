<script lang="ts">
	import { dashboardCopy } from '../dashboard-copy';

	interface Props {
		totalEnrolled: number;
		inProgress: number;
		completed: number;
		notStarted: number;
	}

	let { totalEnrolled, inProgress, completed, notStarted }: Props = $props();

	// Calculate overall completion percentage
	const overallProgress = $derived(
		totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0
	);

	const stats = $derived([
		{
			label: dashboardCopy.sections.stats.totalEnrolled.label,
			value: totalEnrolled,
			unit:
				totalEnrolled === 1
					? dashboardCopy.sections.stats.totalEnrolled.singular
					: dashboardCopy.sections.stats.totalEnrolled.plural,
			icon: '📚',
			color: 'blue'
		},
		{
			label: dashboardCopy.sections.stats.inProgress.label,
			value: inProgress,
			unit:
				inProgress === 1
					? dashboardCopy.sections.stats.inProgress.singular
					: dashboardCopy.sections.stats.inProgress.plural,
			icon: '⚡',
			color: 'light-orange'
		},
		{
			label: dashboardCopy.sections.stats.completed.label,
			value: completed,
			unit:
				completed === 1
					? dashboardCopy.sections.stats.completed.singular
					: dashboardCopy.sections.stats.completed.plural,
			icon: '✓',
			color: 'dark-green'
		},
		{
			label: dashboardCopy.sections.stats.notStarted.label,
			value: notStarted,
			unit:
				notStarted === 1
					? dashboardCopy.sections.stats.notStarted.singular
					: dashboardCopy.sections.stats.notStarted.plural,
			icon: '○',
			color: 'dark-grey'
		}
	]);
</script>

<div class="mb-8">
	<h2 class="text-xl font-semibold text-gray-900 mb-4">
		{dashboardCopy.sections.stats.title}
	</h2>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each stats as stat}
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
				<div class="flex items-start justify-between mb-3">
					<div class="text-2xl" role="img" aria-label={stat.label}>
						{stat.icon}
					</div>
				</div>
				<div class="text-3xl font-bold text-gray-900 mb-1">
					{stat.value}
				</div>
				<div class="text-sm text-gray-600">
					{stat.label}
				</div>
			</div>
		{/each}
	</div>

	<!-- Overall Progress Bar -->
	{#if totalEnrolled > 0}
		<div class="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
			<div class="flex items-center justify-between mb-3">
				<span class="text-sm font-medium text-gray-700">
					{dashboardCopy.sections.stats.overall.label}
				</span>
				<span class="text-sm font-medium text-blue">{overallProgress}%</span>
			</div>
			<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
				<div
					class="h-full bg-gradient-to-r from-blue to-light-orange transition-all duration-300"
					style="width: {overallProgress}%"
				></div>
			</div>
		</div>
	{/if}
</div>
