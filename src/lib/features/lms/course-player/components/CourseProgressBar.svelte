<script lang="ts">
	import { coursePlayerCopy } from '../course-player-copy';

	interface Props {
		completionPercentage: number;
		completedActivities: number;
		totalActivities: number;
		showFraction?: boolean;
		size?: 'sm' | 'md' | 'lg';
	}

	let {
		completionPercentage,
		completedActivities,
		totalActivities,
		showFraction = true,
		size = 'md'
	}: Props = $props();

	const heightClass = $derived({
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3'
	}[size]);

	const fractionText = $derived(
		coursePlayerCopy.progress.activitiesCompleted
			.replace('{{completed}}', completedActivities.toString())
			.replace('{{total}}', totalActivities.toString())
	);
</script>

<div class="w-full">
	{#if showFraction}
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm font-medium text-gray-700">
				{coursePlayerCopy.labels.progress}
			</span>
			<div class="text-right">
				<span class="text-sm font-medium text-blue">{completionPercentage}%</span>
				<span class="text-xs text-gray-500 ml-2">{fractionText}</span>
			</div>
		</div>
	{/if}

	<div
		class="w-full bg-gray-200 rounded-full overflow-hidden {heightClass}"
		role="progressbar"
		aria-valuenow={completionPercentage}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label={coursePlayerCopy.accessibility.progressBar.replace('{{percentage}}', completionPercentage.toString())}
	>
		<div
			class="h-full bg-gradient-to-r from-blue to-light-orange transition-all duration-500 ease-out"
			style="width: {completionPercentage}%"
		></div>
	</div>
</div>
