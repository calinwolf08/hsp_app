<script lang="ts">
	import type { Course, CourseEnrollment, CourseProgress, ProgressStatus } from '../../shared/types';
	import { Button } from '$lib/components/ui/button';
	import { dashboardCopy } from '../dashboard-copy';

	interface Props {
		course: Course;
		enrollment: CourseEnrollment;
		progress: CourseProgress | null;
		completionPercentage: number;
		status: ProgressStatus;
	}

	let { course, enrollment, progress, completionPercentage, status }: Props = $props();

	// Determine button text based on status
	const buttonText = $derived(
		status === 'not-started' ? dashboardCopy.actions.startCourse : dashboardCopy.actions.continueCourse
	);

	// Status badge styling
	const statusClasses = $derived({
		'not-started': 'bg-gray-100 text-gray-800',
		'in-progress': 'bg-blue/10 text-blue',
		'completed': 'bg-green-100 text-green-800'
	}[status]);

	// Format last accessed date
	const lastAccessed = $derived(() => {
		const date = progress?.updatedAt || enrollment.createdAt;
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	});

	// Navigate to course
	const handleNavigate = () => {
		window.location.href = `/courses/${course.id}`;
	};
</script>

<div
	class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
	onclick={handleNavigate}
	role="link"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleNavigate()}
>
	<!-- Course Image -->
	{#if course.thumbnail}
		<div class="w-full h-48 bg-gray-200 overflow-hidden">
			<img
				src={course.thumbnail}
				alt={course.name}
				class="w-full h-full object-cover"
			/>
		</div>
	{:else}
		<div class="w-full h-48 bg-gradient-to-br from-blue to-light-orange flex items-center justify-center">
			<span class="text-white text-4xl font-bold">{course.name.charAt(0).toUpperCase()}</span>
		</div>
	{/if}

	<!-- Card Content -->
	<div class="p-6">
		<!-- Status Badge -->
		<div class="flex items-center justify-between mb-3">
			<span class="text-xs font-medium px-3 py-1 rounded-full {statusClasses}">
				{status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
			</span>
			<span class="text-xs text-gray-500">{lastAccessed()}</span>
		</div>

		<!-- Course Title -->
		<h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
			{course.name}
		</h3>

		<!-- Course Description -->
		{#if course.description}
			<p class="text-sm text-gray-600 mb-4 line-clamp-2">
				{course.description}
			</p>
		{/if}

		<!-- Progress Bar -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<span class="text-xs font-medium text-gray-700">Progress</span>
				<span class="text-xs font-medium text-blue">{completionPercentage}%</span>
			</div>
			<div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
				<div
					class="h-full bg-light-orange transition-all duration-300"
					style="width: {completionPercentage}%"
				></div>
			</div>
		</div>

		<!-- Action Button -->
		<Button
			variant="primary"
			class="w-full"
			onclick={(e) => {
				e.stopPropagation();
				handleNavigate();
			}}
		>
			{buttonText}
		</Button>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
