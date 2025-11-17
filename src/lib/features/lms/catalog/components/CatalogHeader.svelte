<script lang="ts">
	import { catalogCopy } from '../catalog-copy';

	interface Props {
		totalCourses: number;
		activeFilterCount: number;
	}

	let { totalCourses, activeFilterCount }: Props = $props();
</script>

<div class="mb-6">
	<h1 class="text-3xl font-bold text-gray-900 mb-2">
		{catalogCopy.page.title}
	</h1>
	<div class="flex items-center gap-3">
		<p class="text-gray-600">
			{catalogCopy.page.description}
		</p>
		{#if activeFilterCount > 0}
			<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue/10 text-blue">
				{activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
			</span>
		{/if}
	</div>
	<p class="text-sm text-gray-500 mt-2">
		{totalCourses} {totalCourses === 1 ? 'course' : 'courses'} available
	</p>
</div>
