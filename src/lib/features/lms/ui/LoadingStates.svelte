<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		variant?: 'course-card' | 'progress' | 'list' | 'player';
		count?: number;
		class?: string;
	};

	let { variant = 'course-card', count = 3, class: className }: Props = $props();
</script>

{#if variant === 'course-card'}
	<div class={cn('overflow-hidden', className)} data-testid="course-card-skeleton">
		<div class="animate-pulse">
			<div class="mb-4 h-40 w-full rounded-xl bg-gray-200"></div>
			<div class="space-y-3">
				<div class="h-4 w-3/4 rounded bg-gray-200"></div>
				<div class="h-3 w-1/2 rounded bg-gray-200"></div>
			</div>
		</div>
	</div>
{:else if variant === 'progress'}
	<div class={cn('space-y-2', className)} data-testid="progress-skeleton">
		<div class="animate-pulse">
			<div class="h-2 w-full rounded-full bg-gray-200"></div>
			<div class="mt-1 h-3 w-12 rounded bg-gray-200"></div>
		</div>
	</div>
{:else if variant === 'list'}
	<div class={cn('space-y-4', className)} data-testid="list-skeleton">
		{#each Array.from({ length: count }) as _, i}
			<div key={i} class="animate-pulse">
				<div class="flex items-center space-x-4">
					<div class="h-12 w-12 rounded-full bg-gray-200"></div>
					<div class="flex-1 space-y-2">
						<div class="h-4 w-3/4 rounded bg-gray-200"></div>
						<div class="h-3 w-1/2 rounded bg-gray-200"></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else if variant === 'player'}
	<div class={cn('flex gap-4', className)} data-testid="player-skeleton">
		<div class="w-64 animate-pulse space-y-4">
			<div class="h-8 w-full rounded bg-gray-200"></div>
			<div class="space-y-2">
				<div class="h-6 w-full rounded bg-gray-200"></div>
				<div class="h-6 w-full rounded bg-gray-200"></div>
				<div class="h-6 w-full rounded bg-gray-200"></div>
			</div>
		</div>
		<div class="flex-1 animate-pulse">
			<div class="h-96 w-full rounded-xl bg-gray-200"></div>
		</div>
	</div>
{/if}
