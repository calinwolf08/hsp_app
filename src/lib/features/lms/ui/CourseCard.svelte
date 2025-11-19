<script lang="ts">
	import { cn } from '$lib/utils';
	import type { CourseDepth1, ProgressStatus } from '../shared/types';
	import ProgressBar from './ProgressBar.svelte';
	import StatusBadge from './StatusBadge.svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	type Props = {
		course: CourseDepth1;
		progress?: number;
		status?: ProgressStatus;
		href: string;
		showEnrollButton?: boolean;
		onEnroll?: () => void;
		class?: string;
	};

	let {
		course,
		progress,
		status,
		href,
		showEnrollButton = false,
		onEnroll,
		class: className
	}: Props = $props();

	const hasProgress = $derived(progress !== undefined && progress > 0);
</script>

<Card class={cn('overflow-hidden transition-shadow hover:shadow-md', className)} data-testid="course-card">
	<CardHeader>
		<div class="flex items-start justify-between gap-2">
			<div class="flex-1">
				<CardTitle class="line-clamp-2">
					<a {href} class="hover:text-light-orange" data-testid="course-card-title-link">
						{course.name}
					</a>
				</CardTitle>
				{#if course.description}
					<CardDescription class="line-clamp-2 mt-1">
						<!-- Note: In a real app, you'd render Lexical rich text properly -->
						Course description
					</CardDescription>
				{/if}
			</div>
			{#if status}
				<div data-testid="course-card-status">
					<StatusBadge {status} size="sm" />
				</div>
			{/if}
		</div>
	</CardHeader>

	<CardContent>
		{#if hasProgress}
			<div class="mb-4" data-testid="course-card-progress">
				<div class="mb-1 flex items-center justify-between text-sm">
					<span class="text-gray-600">Progress</span>
					<span class="font-medium">{progress}%</span>
				</div>
				<ProgressBar percentage={progress ?? 0} />
			</div>
		{/if}

		<div class="flex items-center justify-between gap-2">
			<a {href}>
				<Button variant="outline" size="sm" data-testid="course-card-view-button">View Course</Button>
			</a>
			{#if showEnrollButton && onEnroll}
				<Button variant="primary" size="sm" onclick={onEnroll} data-testid="course-card-enroll-button">Enroll</Button>
			{/if}
		</div>
	</CardContent>
</Card>
