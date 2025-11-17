<script lang="ts">
	import type { PageData } from './$types';
	import DashboardHeader from '$lib/features/lms/dashboard/components/DashboardHeader.svelte';
	import DashboardStats from '$lib/features/lms/dashboard/components/DashboardStats.svelte';
	import DashboardCourseCard from '$lib/features/lms/dashboard/components/DashboardCourseCard.svelte';
	import DashboardEmptyState from '$lib/features/lms/dashboard/components/DashboardEmptyState.svelte';
	import { dashboardCopy } from '$lib/features/lms/dashboard/dashboard-copy';
	import type { SortOption, FilterOption, DashboardCourse, DashboardStats as Stats } from '$lib/features/lms/dashboard/types';
	import { onMount } from 'svelte';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	// State
	let sortBy = $state<SortOption>('recent');
	let statusFilter = $state<FilterOption>('all');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let courses = $state<DashboardCourse[]>([]);
	let stats = $state<Stats>({
		totalEnrolled: 0,
		inProgress: 0,
		completed: 0,
		notStarted: 0,
		overallCompletionPercentage: 0
	});

	// Fetch dashboard data from API
	const fetchDashboardData = async () => {
		loading = true;
		error = null;

		try {
			const url = new URL('/api/dashboard', window.location.origin);
			url.searchParams.set('sort', sortBy);
			url.searchParams.set('status', statusFilter);

			const response = await fetch(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error('Failed to load dashboard data');
			}

			const data = await response.json();
			courses = data.courses;
			stats = data.stats;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load dashboard data';
			console.error('Dashboard fetch error:', err);
		} finally {
			loading = false;
		}
	};

	// Load data on mount and when filters change
	onMount(() => {
		fetchDashboardData();
	});

	// Watch for filter changes
	$effect(() => {
		// Trigger when sortBy or statusFilter changes
		sortBy;
		statusFilter;
		fetchDashboardData();
	});

	// Computed
	const displayedCourses = $derived(courses);
	const hasEnrollments = $derived(stats.totalEnrolled > 0);
	const hasCourses = $derived(courses.length > 0);
</script>

<svelte:head>
	<title>{dashboardCopy.page.title}</title>
	<meta name="description" content={dashboardCopy.page.description} />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl" data-testid="dashboard-page">
	<!-- Header with filters -->
	<DashboardHeader
		{sortBy}
		{statusFilter}
		courseCount={displayedCourses.length}
		onSortChange={(sort) => (sortBy = sort)}
		onFilterChange={(filter) => (statusFilter = filter)}
	/>

	<!-- Loading State -->
	{#if loading}
		<div class="flex items-center justify-center py-16">
			<div class="text-center">
				<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue border-r-transparent"></div>
				<p class="mt-4 text-gray-600">Loading your dashboard...</p>
			</div>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center" data-testid="error-state">
			<p class="text-lg font-semibold text-red-900">
				{dashboardCopy.errors.loadingFailed.title}
			</p>
			<p class="mt-2 text-sm text-red-700">
				{error}
			</p>
		</div>
	{:else if !hasEnrollments}
		<!-- No enrollments empty state -->
		<DashboardEmptyState variant="noCourses" />
	{:else}
		<!-- Stats -->
		<DashboardStats
			totalEnrolled={stats.totalEnrolled}
			inProgress={stats.inProgress}
			completed={stats.completed}
			notStarted={stats.notStarted}
		/>

		<!-- Courses Section -->
		<div class="mb-8">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">
				{dashboardCopy.sections.allCourses.title}
			</h2>

			{#if !hasCourses}
				<!-- No courses after filtering -->
				<DashboardEmptyState variant="noFiltered" />
			{:else}
				<!-- Course Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each displayedCourses as dashboardCourse}
						<DashboardCourseCard
							course={dashboardCourse.course}
							enrollment={dashboardCourse.enrollment}
							progress={dashboardCourse.progress}
							completionPercentage={dashboardCourse.completionPercentage}
							status={dashboardCourse.status}
						/>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
