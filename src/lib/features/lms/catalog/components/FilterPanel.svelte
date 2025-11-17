<script lang="ts">
	import type { Category, Tag } from '../../shared/types';
	import { catalogCopy } from '../catalog-copy';

	interface Props {
		categories: Category[];
		tags: Tag[];
		selectedCategories: string[];
		selectedTags: string[];
		enrollmentStatus: 'all' | 'enrolled' | 'not-enrolled';
		onCategoriesChange: (ids: string[]) => void;
		onTagsChange: (ids: string[]) => void;
		onEnrollmentChange: (status: 'all' | 'enrolled' | 'not-enrolled') => void;
		onClearAll: () => void;
	}

	let {
		categories,
		tags,
		selectedCategories,
		selectedTags,
		enrollmentStatus,
		onCategoriesChange,
		onTagsChange,
		onEnrollmentChange,
		onClearAll
	}: Props = $props();

	let categoriesExpanded = $state(true);
	let tagsExpanded = $state(true);
	let enrollmentExpanded = $state(true);

	const toggleCategory = (categoryId: string) => {
		const newSelection = selectedCategories.includes(categoryId)
			? selectedCategories.filter((id) => id !== categoryId)
			: [...selectedCategories, categoryId];
		onCategoriesChange(newSelection);
	};

	const toggleTag = (tagId: string) => {
		const newSelection = selectedTags.includes(tagId)
			? selectedTags.filter((id) => id !== tagId)
			: [...selectedTags, tagId];
		onTagsChange(newSelection);
	};

	const activeFilterCount = $derived(
		selectedCategories.length + selectedTags.length + (enrollmentStatus !== 'all' ? 1 : 0)
	);

	const enrollmentOptions = [
		{ value: 'all' as const, label: catalogCopy.enrollmentStatus.all },
		{ value: 'enrolled' as const, label: catalogCopy.enrollmentStatus.enrolled },
		{ value: 'not-enrolled' as const, label: catalogCopy.enrollmentStatus.notEnrolled }
	];
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<h3 class="text-lg font-semibold text-gray-900">
			{catalogCopy.filters.title}
			{#if activeFilterCount > 0}
				<span class="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-blue rounded-full">
					{activeFilterCount}
				</span>
			{/if}
		</h3>
		{#if activeFilterCount > 0}
			<button
				type="button"
				onclick={onClearAll}
				class="text-sm text-blue hover:text-blue/80 font-medium"
				aria-label={catalogCopy.accessibility.clearFiltersButton}
			>
				{catalogCopy.filters.clearAll}
			</button>
		{/if}
	</div>

	<!-- Enrollment Status -->
	<div class="mb-6">
		<button
			type="button"
			onclick={() => (enrollmentExpanded = !enrollmentExpanded)}
			class="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3"
		>
			<span>{catalogCopy.filters.enrollmentStatus}</span>
			<svg
				class="w-5 h-5 transform transition-transform {enrollmentExpanded ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if enrollmentExpanded}
			<div class="space-y-2">
				{#each enrollmentOptions as option}
					<label class="flex items-center cursor-pointer">
						<input
							type="radio"
							name="enrollment-status"
							value={option.value}
							checked={enrollmentStatus === option.value}
							onchange={() => onEnrollmentChange(option.value)}
							class="w-4 h-4 text-blue border-gray-300 focus:ring-blue"
						/>
						<span class="ml-2 text-sm text-gray-700">{option.label}</span>
					</label>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Categories -->
	{#if categories.length > 0}
		<div class="mb-6">
			<button
				type="button"
				onclick={() => (categoriesExpanded = !categoriesExpanded)}
				class="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3"
			>
				<span>
					{catalogCopy.filters.categories}
					{#if selectedCategories.length > 0}
						<span class="ml-1 text-gray-500">({selectedCategories.length})</span>
					{/if}
				</span>
				<svg
					class="w-5 h-5 transform transition-transform {categoriesExpanded ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{#if categoriesExpanded}
				<div class="space-y-2 max-h-48 overflow-y-auto">
					{#each categories as category}
						<label class="flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={selectedCategories.includes(category.id)}
								onchange={() => toggleCategory(category.id)}
								class="w-4 h-4 text-blue border-gray-300 rounded focus:ring-blue"
								aria-label={catalogCopy.accessibility.categoryCheckbox.replace('{{categoryName}}', category.name)}
							/>
							<span class="ml-2 text-sm text-gray-700">{category.name}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Tags -->
	{#if tags.length > 0}
		<div>
			<button
				type="button"
				onclick={() => (tagsExpanded = !tagsExpanded)}
				class="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3"
			>
				<span>
					{catalogCopy.filters.tags}
					{#if selectedTags.length > 0}
						<span class="ml-1 text-gray-500">({selectedTags.length})</span>
					{/if}
				</span>
				<svg
					class="w-5 h-5 transform transition-transform {tagsExpanded ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{#if tagsExpanded}
				<div class="space-y-2 max-h-48 overflow-y-auto">
					{#each tags as tag}
						<label class="flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={selectedTags.includes(tag.id)}
								onchange={() => toggleTag(tag.id)}
								class="w-4 h-4 text-blue border-gray-300 rounded focus:ring-blue"
								aria-label={catalogCopy.accessibility.tagCheckbox.replace('{{tagName}}', tag.name)}
							/>
							<span class="ml-2 text-sm text-gray-700">{tag.name}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
