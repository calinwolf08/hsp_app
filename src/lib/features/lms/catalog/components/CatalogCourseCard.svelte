<script lang="ts">
	import type { Course } from '../../shared/types';
	import { Button } from '$lib/components/ui/button';
	import { catalogCopy } from '../catalog-copy';

	interface Props {
		course: Course;
		isEnrolled: boolean;
		enrollmentId?: string;
		onEnroll?: (courseId: string) => Promise<void>;
		onUnenroll?: (courseId: string) => Promise<void>;
	}

	let { course, isEnrolled, enrollmentId, onEnroll, onUnenroll }: Props = $props();

	let enrolling = $state(false);

	const handleEnroll = async (e: MouseEvent) => {
		e.stopPropagation();
		if (!onEnroll || enrolling) return;

		enrolling = true;
		try {
			await onEnroll(course.id);
		} finally {
			enrolling = false;
		}
	};

	const handleUnenroll = async (e: MouseEvent) => {
		e.stopPropagation();
		if (!onUnenroll || enrolling || !enrollmentId) return;

		if (!confirm(catalogCopy.enrollment.confirmUnenroll)) return;

		enrolling = true;
		try {
			await onUnenroll(course.id);
		} finally {
			enrolling = false;
		}
	};

	const handleCardClick = () => {
		window.location.href = `/courses/${course.id}`;
	};
</script>

<div
	class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
	onclick={handleCardClick}
	role="link"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleCardClick()}
	data-testid="course-card"
>
	<!-- Course Image -->
	<div class="w-full h-48 bg-gradient-to-br from-blue to-light-orange flex items-center justify-center">
		<span class="text-white text-4xl font-bold">{course.name.charAt(0).toUpperCase()}</span>
	</div>

	<!-- Card Content -->
	<div class="p-6">
		<!-- Title -->
		<h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" data-testid="course-title">
			{course.name}
		</h3>

		<!-- Description (if Lexical content exists, show truncated version) -->
		<p class="text-sm text-gray-600 mb-4 line-clamp-3">
			{course.internal_name}
		</p>

		<!-- Action Button -->
		<div class="flex items-center gap-2">
			{#if isEnrolled}
				<span class="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
					{catalogCopy.actions.enrolled}
				</span>
				<Button
					variant="primary"
					size="sm"
					onclick={(e) => {
						e.stopPropagation();
						handleCardClick();
					}}
				>
					{catalogCopy.actions.continue}
				</Button>
			{:else}
				<Button
					variant="primary"
					class="w-full"
					onclick={handleEnroll}
					disabled={enrolling}
				>
					{enrolling ? 'Enrolling...' : catalogCopy.actions.enroll}
				</Button>
			{/if}
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
