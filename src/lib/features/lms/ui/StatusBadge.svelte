<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ProgressStatus } from '../shared/types';
	import { sharedCopy } from '../shared/shared-copy';

	type Props = {
		status: ProgressStatus;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	};

	let { status, size = 'md', class: className }: Props = $props();

	const statusConfig = {
		'not-started': {
			label: sharedCopy.status.notStarted,
			classes: 'bg-gray-100 text-gray-700 border-gray-300'
		},
		'in-progress': {
			label: sharedCopy.status.inProgress,
			classes: 'bg-blue-100 text-blue-700 border-blue-300'
		},
		completed: {
			label: sharedCopy.status.completed,
			classes: 'bg-green-100 text-green-700 border-green-300'
		}
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm',
		lg: 'px-3 py-1.5 text-base'
	};

	const config = $derived(statusConfig[status]);
</script>

<span
	class={cn(
		'inline-flex items-center rounded-full border font-medium',
		config.classes,
		sizeClasses[size],
		className
	)}
	data-testid="status-badge"
>
	{config.label}
</span>
