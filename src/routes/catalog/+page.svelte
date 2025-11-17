<script lang="ts">
	import { onMount } from 'svelte';
	import { catalogCopy } from '$lib/features/lms/catalog/catalog-copy';
	import { countActiveFilters } from '$lib/features/lms/catalog/utils/catalog-filters';
	import type { SortOption, CatalogCourse, PaginationState } from '$lib/features/lms/catalog/types';
	import type { Category, Tag } from '$lib/features/lms/shared/types';

	import CatalogHeader from '$lib/features/lms/catalog/components/CatalogHeader.svelte';
	import SearchBar from '$lib/features/lms/catalog/components/SearchBar.svelte';
	import FilterPanel from '$lib/features/lms/catalog/components/FilterPanel.svelte';
	import SortControls from '$lib/features/lms/catalog/components/SortControls.svelte';
	import CourseGrid from '$lib/features/lms/catalog/components/CourseGrid.svelte';
	import Pagination from '$lib/features/lms/catalog/components/Pagination.svelte';

	// State
	let searchTerm = $state('');
	let selectedCategories = $state<string[]>([]);
	let selectedTags = $state<string[]>([]);
	let sortBy = $state<SortOption>('title-asc');
	let enrollmentFilter = $state<'all' | 'enrolled' | 'not-enrolled'>('all');
	let currentPage = $state(1);

	let courses = $state<CatalogCourse[]>([]);
	let categories = $state<Category[]>([]);
	let tags = $state<Tag[]>([]);
	let pagination = $state<PaginationState>({
		page: 1,
		pageSize: 12,
		totalItems: 0,
		totalPages: 0
	});

	let loading = $state(false);
	let error = $state<string | null>(null);

	// Fetch catalog data
	const fetchCatalog = async () => {
		loading = true;
		error = null;

		try {
			const url = new URL('/api/catalog', window.location.origin);

			if (searchTerm) url.searchParams.set('search', searchTerm);
			if (selectedCategories.length) url.searchParams.set('categories', selectedCategories.join(','));
			if (selectedTags.length) url.searchParams.set('tags', selectedTags.join(','));
			url.searchParams.set('sort', sortBy);
			url.searchParams.set('page', currentPage.toString());
			url.searchParams.set('limit', '12');
			url.searchParams.set('enrollmentStatus', enrollmentFilter);

			const response = await fetch(url.toString(), {
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error('Failed to load catalog');
			}

			const data = await response.json();
			courses = data.courses;
			pagination = data.pagination;
			categories = data.filters.categories || [];
			tags = data.filters.tags || [];
		} catch (err) {
			error = err instanceof Error ? err.message : catalogCopy.errors.loadFailed;
			console.error('Catalog fetch error:', err);
		} finally {
			loading = false;
		}
	};

	// Enrollment actions
	const handleEnroll = async (courseId: string) => {
		try {
			const response = await fetch(`/api/courses/${courseId}/enroll`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({ source: 'direct' })
			});

			if (!response.ok) {
				throw new Error('Enrollment failed');
			}

			// Refresh catalog to update enrollment status
			await fetchCatalog();
		} catch (err) {
			console.error('Enrollment error:', err);
			alert(catalogCopy.enrollment.error);
		}
	};

	const handleUnenroll = async (courseId: string) => {
		try {
			const response = await fetch(`/api/courses/${courseId}/enroll`, {
				method: 'DELETE',
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error('Unenrollment failed');
			}

			// Refresh catalog to update enrollment status
			await fetchCatalog();
		} catch (err) {
			console.error('Unenrollment error:', err);
			alert(catalogCopy.enrollment.unenrollError);
		}
	};

	// Filter actions
	const handleSearchChange = (value: string) => {
		searchTerm = value;
		currentPage = 1; // Reset to page 1 when searching
	};

	const handleCategoriesChange = (ids: string[]) => {
		selectedCategories = ids;
		currentPage = 1;
	};

	const handleTagsChange = (ids: string[]) => {
		selectedTags = ids;
		currentPage = 1;
	};

	const handleEnrollmentChange = (status: 'all' | 'enrolled' | 'not-enrolled') => {
		enrollmentFilter = status;
		currentPage = 1;
	};

	const handleSortChange = (option: SortOption) => {
		sortBy = option;
		currentPage = 1;
	};

	const handlePageChange = (page: number) => {
		currentPage = page;
	};

	const handleClearFilters = () => {
		searchTerm = '';
		selectedCategories = [];
		selectedTags = [];
		enrollmentFilter = 'all';
		currentPage = 1;
	};

	// Computed
	const activeFilterCount = $derived(
		countActiveFilters({
			searchTerm,
			categoryIds: selectedCategories,
			tagIds: selectedTags,
			enrollmentStatus: enrollmentFilter
		})
	);

	// Load on mount and when filters change
	onMount(() => {
		fetchCatalog();
	});

	$effect(() => {
		// Trigger refetch when any filter changes
		searchTerm;
		selectedCategories;
		selectedTags;
		sortBy;
		enrollmentFilter;
		currentPage;
		fetchCatalog();
	});
</script>

<svelte:head>
	<title>{catalogCopy.page.title}</title>
	<meta name="description" content={catalogCopy.page.description} />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
	<CatalogHeader totalCourses={pagination.totalItems} {activeFilterCount} />

	<div class="flex flex-col lg:flex-row gap-6">
		<!-- Sidebar Filters -->
		<aside class="lg:w-64 flex-shrink-0">
			<FilterPanel
				{categories}
				{tags}
				{selectedCategories}
				{selectedTags}
				enrollmentStatus={enrollmentFilter}
				onCategoriesChange={handleCategoriesChange}
				onTagsChange={handleTagsChange}
				onEnrollmentChange={handleEnrollmentChange}
				onClearAll={handleClearFilters}
			/>
		</aside>

		<!-- Main Content -->
		<main class="flex-1">
			<!-- Search and Sort Controls -->
			<div class="mb-6 flex flex-col sm:flex-row gap-4">
				<div class="flex-1">
					<SearchBar value={searchTerm} onSearch={handleSearchChange} />
				</div>
				<div>
					<SortControls {sortBy} onSortChange={handleSortChange} />
				</div>
			</div>

			<!-- Loading State -->
			{#if loading && courses.length === 0}
				<div class="flex items-center justify-center py-16">
					<div class="text-center">
						<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue border-r-transparent"></div>
						<p class="mt-4 text-gray-600">{catalogCopy.messages.loading}</p>
					</div>
				</div>
			{:else if error}
				<!-- Error State -->
				<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
					<p class="text-lg font-semibold text-red-900">
						{catalogCopy.errors.loadFailed}
					</p>
					<p class="mt-2 text-sm text-red-700">
						{error}
					</p>
				</div>
			{:else}
				<!-- Course Grid -->
				<CourseGrid {courses} onEnroll={handleEnroll} onUnenroll={handleUnenroll} {loading} />

				<!-- Pagination -->
				{#if pagination.totalPages > 1}
					<Pagination
						currentPage={pagination.page}
						totalPages={pagination.totalPages}
						totalItems={pagination.totalItems}
						pageSize={pagination.pageSize}
						onPageChange={handlePageChange}
					/>
				{/if}
			{/if}
		</main>
	</div>
</div>
