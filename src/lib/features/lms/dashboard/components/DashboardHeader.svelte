<script lang="ts">
	import type { SortOption, FilterOption } from '../types';
	import { dashboardCopy } from '../dashboard-copy';

	interface Props {
		sortBy: SortOption;
		statusFilter: FilterOption;
		courseCount: number;
		onSortChange: (sort: SortOption) => void;
		onFilterChange: (status: FilterOption) => void;
	}

	let { sortBy, statusFilter, courseCount, onSortChange, onFilterChange }: Props = $props();

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'recent', label: dashboardCopy.filters.sort.options.recent },
		{ value: 'title', label: dashboardCopy.filters.sort.options.title },
		{ value: 'progress', label: dashboardCopy.filters.sort.options.progress }
	];

	const filterOptions: { value: FilterOption; label: string }[] = [
		{ value: 'all', label: dashboardCopy.filters.filter.options.all },
		{ value: 'in-progress', label: dashboardCopy.filters.filter.options['in-progress'] },
		{ value: 'completed', label: dashboardCopy.filters.filter.options.completed },
		{ value: 'not-started', label: dashboardCopy.filters.filter.options['not-started'] }
	];
</script>

<div class="mb-6">
	<!-- Page Title and Description -->
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">
			{dashboardCopy.page.title}
		</h1>
		<p class="text-gray-600">
			{dashboardCopy.page.description}
		</p>
	</div>

	<!-- Controls Row -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<!-- Course Count -->
		<div class="text-sm text-gray-600">
			{courseCount}
			{courseCount === 1 ? 'course' : 'courses'}
		</div>

		<!-- Sort and Filter Controls -->
		<div class="flex flex-col sm:flex-row gap-3">
			<!-- Sort Dropdown -->
			<div class="flex items-center gap-2">
				<label for="sort-select" class="text-sm font-medium text-gray-700">
					{dashboardCopy.filters.sort.label}:
				</label>
				<select
					id="sort-select"
					value={sortBy}
					onchange={(e) => onSortChange(e.currentTarget.value as SortOption)}
					class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue focus:border-blue"
				>
					{#each sortOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<!-- Filter Pills -->
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium text-gray-700">
					{dashboardCopy.filters.filter.label}:
				</span>
				<div class="flex gap-2">
					{#each filterOptions as option}
						<button
							type="button"
							onclick={() => onFilterChange(option.value)}
							class="px-3 py-1 text-sm rounded-full transition-colors {statusFilter === option.value
								? 'bg-blue text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
