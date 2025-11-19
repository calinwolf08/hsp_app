<script lang="ts">
	import type { DashboardCourse } from '../types';
	import { dashboardCopy } from '../dashboard-copy';
	import ProgressBar from '../../ui/ProgressBar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	type Props = {
		course: DashboardCourse | null;
		onClick?: () => void;
		class?: string;
	};

	let { course, onClick, class: className }: Props = $props();
</script>

<div class={cn('rounded-xl border border-gray-200 bg-white p-6 shadow-sm', className)} data-testid="continue-learning-card">
	<div class="mb-4">
		<h3 class="text-lg font-semibold text-blue" data-testid="continue-learning-title">
			{dashboardCopy.sections.continueLearning.title}
		</h3>
		<p class="mt-1 text-sm text-gray-600" data-testid="continue-learning-description">
			{dashboardCopy.sections.continueLearning.description}
		</p>
	</div>

	{#if course}
		<div class="space-y-4" data-testid="continue-learning-content">
			<div>
				<h4 class="text-xl font-bold text-gray-900" data-testid="course-title">
					{course.course.name}
				</h4>
				{#if course.course.description && typeof course.course.description === 'object'}
					<p class="mt-1 text-sm text-gray-600" data-testid="course-description">
						{course.course.internal_name}
					</p>
				{/if}
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between text-sm">
					<span class="font-medium text-gray-700" data-testid="progress-label">Progress</span>
					<span class="font-semibold text-blue" data-testid="progress-percentage">
						{course.completionPercentage}%
					</span>
				</div>
				<ProgressBar
					percentage={course.completionPercentage}
					variant="default"
					size="md"
				/>
			</div>

			<Button
				variant="primary"
				class="w-full"
				onclick={onClick}
				data-testid="continue-button"
			>
				{dashboardCopy.sections.continueLearning.continueButton}
			</Button>
		</div>
	{:else}
		<div class="py-8 text-center" data-testid="continue-learning-empty">
			<p class="text-gray-600" data-testid="empty-state-message">
				{dashboardCopy.sections.continueLearning.emptyState}
			</p>
		</div>
	{/if}
</div>
