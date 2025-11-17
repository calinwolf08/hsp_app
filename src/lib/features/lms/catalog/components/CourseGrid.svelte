<script lang="ts">
	import type { CatalogCourse } from '../types';
	import CatalogCourseCard from './CatalogCourseCard.svelte';
	import { catalogCopy } from '../catalog-copy';

	interface Props {
		courses: CatalogCourse[];
		onEnroll: (courseId: string) => Promise<void>;
		onUnenroll: (courseId: string) => Promise<void>;
		loading?: boolean;
	}

	let { courses, onEnroll, onUnenroll, loading = false }: Props = $props();
</script>

{#if loading}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each Array(6) as _}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
				<div class="w-full h-48 bg-gray-200"></div>
				<div class="p-6">
					<div class="h-6 bg-gray-200 rounded mb-2"></div>
					<div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
					<div class="h-10 bg-gray-200 rounded"></div>
				</div>
			</div>
		{/each}
	</div>
{:else if courses.length === 0}
	<div class="flex flex-col items-center justify-center py-16 px-4">
		<div class="w-24 h-24 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
			<svg
				class="w-12 h-12 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
				/>
			</svg>
		</div>
		<h3 class="text-xl font-semibold text-gray-900 mb-2">
			{catalogCopy.messages.noMatchingCourses}
		</h3>
		<p class="text-gray-600 text-center max-w-md">
			Try adjusting your filters to see more courses.
		</p>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each courses as catalogCourse}
			<CatalogCourseCard
				course={catalogCourse.course}
				isEnrolled={catalogCourse.isEnrolled}
				enrollmentId={catalogCourse.enrollmentId}
				{onEnroll}
				{onUnenroll}
			/>
		{/each}
	</div>
{/if}
