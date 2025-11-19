<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		percentage: number;
		size?: number;
		strokeWidth?: number;
		showLabel?: boolean;
		class?: string;
	};

	let {
		percentage = 0,
		size = 100,
		strokeWidth = 8,
		showLabel = true,
		class: className
	}: Props = $props();

	const clampedPercentage = $derived(Math.min(100, Math.max(0, percentage)));
	const radius = $derived((size - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const offset = $derived(circumference - (clampedPercentage / 100) * circumference);
	const center = $derived(size / 2);
</script>

<div class={cn('relative inline-flex items-center justify-center', className)}>
	<svg width={size} height={size} class="rotate-[-90deg]" data-testid="progress-circle-svg">
		<!-- Background circle -->
		<circle
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke="currentColor"
			stroke-width={strokeWidth}
			class="text-light-grey"
			data-testid="progress-circle-background"
		/>
		<!-- Progress circle -->
		<circle
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke="currentColor"
			stroke-width={strokeWidth}
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			stroke-linecap="round"
			class="text-light-orange transition-all duration-300"
			data-testid="progress-circle-progress"
		/>
	</svg>
	{#if showLabel}
		<div class="absolute inset-0 flex items-center justify-center" data-testid="progress-circle-label">
			<span class="text-sm font-semibold">{Math.round(clampedPercentage)}%</span>
		</div>
	{/if}
</div>
