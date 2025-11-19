<script lang="ts">
	import type { SortOption } from '../types';
	import { catalogCopy } from '../catalog-copy';

	interface Props {
		sortBy: SortOption;
		onSortChange: (option: SortOption) => void;
	}

	let { sortBy, onSortChange }: Props = $props();

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'title-asc', label: catalogCopy.sort.titleAsc },
		{ value: 'title-desc', label: catalogCopy.sort.titleDesc },
		{ value: 'recent', label: catalogCopy.sort.recent },
		{ value: 'popular', label: catalogCopy.sort.popular }
	];
</script>

<div class="flex items-center gap-2">
	<label for="sort-select" class="text-sm font-medium text-gray-700 whitespace-nowrap">
		{catalogCopy.sort.label}:
	</label>
	<select
		id="sort-select"
		value={sortBy}
		onchange={(e) => onSortChange(e.currentTarget.value as SortOption)}
		class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue focus:border-blue bg-white"
		aria-label={catalogCopy.accessibility.sortSelect}
	>
		{#each sortOptions as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
