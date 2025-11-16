<script lang="ts">
	import { cn } from '$lib/utils';
	import { Check } from '@lucide/svelte';

	type Props = {
		completed: boolean;
		size?: 'sm' | 'md' | 'lg';
		showBorder?: boolean;
		class?: string;
	};

	let { completed, size = 'md', showBorder = true, class: className }: Props = $props();

	const sizeConfig = {
		sm: { container: 'h-4 w-4', icon: 12 },
		md: { container: 'h-5 w-5', icon: 16 },
		lg: { container: 'h-6 w-6', icon: 20 }
	};

	const config = $derived(sizeConfig[size]);
</script>

<div
	class={cn(
		'inline-flex items-center justify-center rounded-full transition-colors',
		config.container,
		completed
			? 'bg-dark-green text-white'
			: showBorder
				? 'border-2 border-gray-300 bg-white'
				: 'bg-gray-100 text-gray-400',
		className
	)}
	data-testid="completion-checkmark"
>
	{#if completed}
		<Check size={config.icon} strokeWidth={3} data-testid="completion-checkmark-icon" />
	{/if}
</div>
