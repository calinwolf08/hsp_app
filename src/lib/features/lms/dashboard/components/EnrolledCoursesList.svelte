<script lang="ts">
	import type { DashboardCourse, FilterOptions, SortOption, FilterOption } from '../types';
	import { dashboardCopy } from '../dashboard-copy';
	import CourseCard from '../../ui/CourseCard.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		courses: DashboardCourse[];
		filters?: FilterOptions;
		onFilterChange?: (filters: FilterOptions) => void;
		loading?: boolean;
		class?: string;
	};

	let {
		courses,
		filters = { sort: 'recent', filter: 'all' },
		onFilterChange,
		loading = false,
		class: className
	}: Props = $props();

	const handleSortChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		const newFilters = { ...filters, sort: target.value as SortOption };
		onFilterChange?.(newFilters);
	};

	const handleFilterChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		const newFilters = { ...filters, filter: target.value as FilterOption };
		onFilterChange?.(newFilters);
	};
</script>

<div class={cn('space-y-6', className)} data-testid="enrolled-courses-list">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-2xl font-bold text-blue" data-testid="enrolled-courses-title">
				{dashboardCopy.sections.allCourses.title}
			</h2>
			<p class="mt-1 text-sm text-gray-600" data-testid="enrolled-courses-description">
				{dashboardCopy.sections.allCourses.description}
			</p>
		</div>

		{#if courses.length > 0 && !loading}
			<div class="flex gap-3" data-testid="filter-controls">
				<div class="flex flex-col gap-1">
					<label for="sort-select" class="text-xs font-medium text-gray-600">
						{dashboardCopy.filters.sort.label}
					</label>
					<select
						id="sort-select"
						class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
						value={filters.sort}
						onchange={handleSortChange}
						data-testid="sort-select"
					>
						{#each Object.entries(dashboardCopy.filters.sort.options) as [value, label]}
							<option value={value}>{label}</option>
						{/each}
					</select>
				</div>

				<div class="flex flex-col gap-1">
					<label for="filter-select" class="text-xs font-medium text-gray-600">
						{dashboardCopy.filters.filter.label}
					</label>
					<select
						id="filter-select"
						class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
						value={filters.filter}
						onchange={handleFilterChange}
						data-testid="filter-select"
					>
						{#each Object.entries(dashboardCopy.filters.filter.options) as [value, label]}
							<option value={value}>{label}</option>
						{/each}
					</select>
				</div>
			</div>
		{/if}
	</div>

	{#if loading}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="courses-loading">
			{#each Array.from({ length: 6 }) as _}
				<div class="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
					<div class="h-4 w-3/4 rounded bg-gray-200"></div>
					<div class="mt-4 h-3 w-full rounded bg-gray-200"></div>
					<div class="mt-2 h-3 w-2/3 rounded bg-gray-200"></div>
					<div class="mt-6 h-2 w-full rounded bg-gray-200"></div>
					<div class="mt-4 h-10 w-full rounded bg-gray-200"></div>
				</div>
			{/each}
		</div>
	{:else if courses.length === 0}
		<div
			class="rounded-xl border border-gray-200 bg-white p-12 text-center"
			data-testid="empty-state"
		>
			<p class="text-lg font-semibold text-gray-900" data-testid="empty-state-title">
				{dashboardCopy.emptyStates.noFilteredCourses.title}
			</p>
			<p class="mt-2 text-sm text-gray-600" data-testid="empty-state-message">
				{dashboardCopy.emptyStates.noFilteredCourses.message}
			</p>
		</div>
	{:else}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="courses-grid">
			{#each courses as dashboardCourse (dashboardCourse.course.id)}
				<CourseCard
					course={dashboardCourse.course}
					enrollment={dashboardCourse.enrollment}
					progress={dashboardCourse.completionPercentage}
					status={dashboardCourse.status}
				/>
			{/each}
		</div>
	{/if}
</div>
