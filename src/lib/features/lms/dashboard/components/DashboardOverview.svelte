<script lang="ts">
	import type { DashboardData, FilterOptions } from '../types';
	import { filterCourses, sortCourses } from '../utils/dashboard-data';
	import ProgressSummary from './ProgressSummary.svelte';
	import ContinueLearningCard from './ContinueLearningCard.svelte';
	import EnrolledCoursesList from './EnrolledCoursesList.svelte';
	import { cn } from '$lib/utils';
	import { PageSlugs } from '$lib/constants';

	type Props = {
		data: DashboardData;
		loading?: boolean;
		class?: string;
	};

	let { data, loading = false, class: className }: Props = $props();

	let filters = $state<FilterOptions>({ sort: 'recent', filter: 'all' });

	const filteredAndSortedCourses = $derived(() => {
		let courses = data.courses;
		courses = filterCourses(courses, filters.filter);
		courses = sortCourses(courses, filters.sort);
		return courses;
	});

	const handleFilterChange = (newFilters: FilterOptions) => {
		filters = newFilters;
	};

	const handleContinueLearning = () => {
		if (data.continueLearning) {
			window.location.href = `${PageSlugs.courses}/${data.continueLearning.course.slug}`;
		}
	};
</script>

<div class={cn('space-y-8', className)} data-testid="dashboard-overview">
	<ProgressSummary stats={data.stats} {loading} />

	{#if !loading && data.continueLearning}
		<ContinueLearningCard course={data.continueLearning} onClick={handleContinueLearning} />
	{/if}

	<EnrolledCoursesList
		courses={filteredAndSortedCourses()}
		{filters}
		onFilterChange={handleFilterChange}
		{loading}
	/>
</div>
