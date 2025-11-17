<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PageSlugs } from '$lib/constants';
	import { dashboardCopy } from '../dashboard-copy';

	interface Props {
		variant?: 'noCourses' | 'noFiltered' | 'noInProgress';
	}

	let { variant = 'noCourses' }: Props = $props();

	const content = $derived(() => {
		switch (variant) {
			case 'noCourses':
				return dashboardCopy.emptyStates.noCourses;
			case 'noFiltered':
				return dashboardCopy.emptyStates.noFilteredCourses;
			case 'noInProgress':
				return dashboardCopy.emptyStates.noInProgressCourses;
			default:
				return dashboardCopy.emptyStates.noCourses;
		}
	});

	const handleAction = () => {
		if (variant === 'noCourses') {
			window.location.href = PageSlugs.courses;
		} else if (variant === 'noFiltered') {
			// Clear filters - this would be handled by parent component
			window.location.href = PageSlugs.dashboard;
		} else {
			window.location.href = PageSlugs.dashboard;
		}
	};
</script>

<div class="flex flex-col items-center justify-center py-16 px-4">
	<!-- Icon -->
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

	<!-- Title -->
	<h3 class="text-xl font-semibold text-gray-900 mb-2">
		{content().title}
	</h3>

	<!-- Message -->
	<p class="text-gray-600 text-center max-w-md mb-6">
		{content().message}
	</p>

	<!-- Action Button -->
	<Button variant="primary" onclick={handleAction}>
		{content().action}
	</Button>
</div>
