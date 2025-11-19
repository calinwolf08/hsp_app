<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		percentage: number;
		showLabel?: boolean;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'success';
		class?: string;
	};

	let {
		percentage = 0,
		showLabel = false,
		size = 'md',
		variant = 'default',
		class: className
	}: Props = $props();

	const clampedPercentage = $derived(Math.min(100, Math.max(0, percentage)));

	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3'
	};

	const variantClasses = {
		default: 'bg-light-orange',
		success: 'bg-dark-green'
	};
</script>

<div class={cn('w-full', className)} data-testid="progress-bar-wrapper">
	<div
		class={cn('w-full overflow-hidden rounded-full bg-light-grey', sizeClasses[size])}
		data-testid="progress-bar-track"
	>
		<div
			class={cn('h-full transition-all duration-300', variantClasses[variant])}
			style="width: {clampedPercentage}%"
			data-testid="progress-bar-fill"
		></div>
	</div>
	{#if showLabel}
		<div class="mt-1 text-sm text-gray-600" data-testid="progress-bar-label">
			{Math.round(clampedPercentage)}%
		</div>
	{/if}
</div>
