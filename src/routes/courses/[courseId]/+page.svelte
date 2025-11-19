<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { coursePlayerCopy } from '$lib/features/lms/course-player/course-player-copy';
	import CourseNavigation from '$lib/features/lms/course-player/components/CourseNavigation.svelte';
	import ActivityContainer from '$lib/features/lms/course-player/components/ActivityContainer.svelte';
	import NavigationControls from '$lib/features/lms/course-player/components/NavigationControls.svelte';
	import CourseProgressBar from '$lib/features/lms/course-player/components/CourseProgressBar.svelte';
	import type { Course, Activity, ActivityProgress } from '$lib/features/lms/shared/types';
	import type { NavigationItem } from '$lib/features/lms/course-player/types';
	import { PageSlugs } from '$lib/constants';

	// Get course ID from route params
	const courseId = $derived($page.params.courseId);

	// State
	let course = $state<Course | null>(null);
	let navigationTree = $state<NavigationItem[]>([]);
	let currentActivity = $state<Activity | null>(null);
	let currentActivityProgress = $state<ActivityProgress | null>(null);
	let completionPercentage = $state(0);
	let completedActivities = $state(0);
	let totalActivities = $state(0);
	let currentPosition = $state(0);
	let canNavigateNext = $state(false);
	let canNavigatePrevious = $state(false);
	let nextActivityId = $state<string | null>(null);
	let previousActivityId = $state<string | null>(null);

	let loading = $state(true);
	let error = $state<string | null>(null);
	let sidebarOpen = $state(true);

	// Fetch course content
	const fetchCourseContent = async () => {
		loading = true;
		error = null;

		try {
			const response = await fetch(`/api/courses/${courseId}/content`, {
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error('Failed to load course');
			}

			const data = await response.json();
			course = data.course;
			completionPercentage = data.completionPercentage;
			totalActivities = data.totalActivities;

			// Get first activity if no specific activity is selected
			if (course && course.sections.length > 0) {
				const firstSection = typeof course.sections[0].section === 'string'
					? null
					: course.sections[0].section;

				if (firstSection && firstSection.activities.length > 0) {
					const firstActivityItem = firstSection.activities[0];
					const firstActivity = typeof firstActivityItem.activity === 'string'
						? null
						: firstActivityItem.activity;

					if (firstActivity) {
						await loadActivity(firstActivity.id);
					}
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : coursePlayerCopy.errors.loadFailed;
			console.error('Course load error:', err);
		} finally {
			loading = false;
		}
	};

	// Load specific activity
	const loadActivity = async (activityId: string) => {
		try {
			// Fetch activity content
			const activityResponse = await fetch(`/api/activities/${activityId}`, {
				credentials: 'include'
			});

			if (!activityResponse.ok) {
				throw new Error('Failed to load activity');
			}

			const activityData = await activityResponse.json();
			currentActivity = activityData.activity;
			currentActivityProgress = activityData.progress;

			// Fetch navigation data
			const navResponse = await fetch(
				`/api/courses/${courseId}/navigation?activityId=${activityId}`,
				{ credentials: 'include' }
			);

			if (navResponse.ok) {
				const navData = await navResponse.json();
				navigationTree = navData.navigationTree;
				completedActivities = navData.completedCount;

				if (navData.currentActivity) {
					currentPosition = navData.currentActivity.position;
					canNavigateNext = navData.currentActivity.canNavigateNext;
					canNavigatePrevious = navData.currentActivity.canNavigatePrevious;
					nextActivityId = navData.currentActivity.nextActivityId;
					previousActivityId = navData.currentActivity.previousActivityId;
				}
			}
		} catch (err) {
			console.error('Activity load error:', err);
			error = coursePlayerCopy.errors.activityNotFound;
		}
	};

	// Navigation handlers
	const handleNavigate = (activityId: string) => {
		loadActivity(activityId);
	};

	const handleNext = () => {
		if (nextActivityId) {
			loadActivity(nextActivityId);
		}
	};

	const handlePrevious = () => {
		if (previousActivityId) {
			loadActivity(previousActivityId);
		}
	};

	const handleBackToCourse = () => {
		window.location.href = PageSlugs.dashboard;
	};

	// Mark activity complete
	const handleMarkComplete = async () => {
		if (!currentActivity) return;

		try {
			const response = await fetch(`/api/activities/${currentActivity.id}/progress`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ status: 'completed' })
			});

			if (!response.ok) {
				throw new Error('Failed to update progress');
			}

			// Reload activity to get updated progress
			await loadActivity(currentActivity.id);

			// Move to next activity if available
			if (canNavigateNext && nextActivityId) {
				const nextId = nextActivityId;
				setTimeout(() => {
					loadActivity(nextId);
				}, 500);
			}
		} catch (err) {
			console.error('Progress update error:', err);
			alert(coursePlayerCopy.errors.progressSaveFailed);
		}
	};

	onMount(() => {
		fetchCourseContent();
	});
</script>

<svelte:head>
	<title>{course?.name || 'Course Player'}</title>
</svelte:head>

<div class="h-screen flex flex-col">
	{#if loading}
		<!-- Loading State -->
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center">
				<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue border-r-transparent"></div>
				<p class="mt-4 text-gray-600">{coursePlayerCopy.messages.loading}</p>
			</div>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="flex-1 flex items-center justify-center p-4">
			<div class="text-center max-w-md">
				<h2 class="text-xl font-semibold text-red-900 mb-2">
					{coursePlayerCopy.errors.loadFailed}
				</h2>
				<p class="text-red-700 mb-4">{error}</p>
				<button
					onclick={() => window.location.href = PageSlugs.dashboard}
					class="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90"
				>
					{coursePlayerCopy.navigation.backToDashboard}
				</button>
			</div>
		</div>
	{:else if course && currentActivity}
		<!-- Course Player -->
		<div class="flex-1 flex overflow-hidden">
			<!-- Sidebar Navigation -->
			{#if sidebarOpen}
				<aside class="w-80 flex-shrink-0 overflow-hidden">
					<CourseNavigation
						{navigationTree}
						courseName={course.name}
						{completionPercentage}
						{completedActivities}
						{totalActivities}
						currentActivityId={currentActivity.id}
						onNavigate={handleNavigate}
					/>
				</aside>
			{/if}

			<!-- Main Content -->
			<main class="flex-1 flex flex-col overflow-hidden">
				<!-- Activity Content -->
				<div class="flex-1 overflow-auto">
					<ActivityContainer
						activity={currentActivity}
						progress={currentActivityProgress}
						onComplete={handleMarkComplete}
					/>
				</div>

				<!-- Navigation Controls -->
				<NavigationControls
					{canNavigatePrevious}
					{canNavigateNext}
					currentPosition={currentPosition}
					totalActivities={totalActivities}
					onPrevious={handlePrevious}
					onNext={handleNext}
					onBackToCourse={handleBackToCourse}
				/>
			</main>
		</div>
	{/if}
</div>
