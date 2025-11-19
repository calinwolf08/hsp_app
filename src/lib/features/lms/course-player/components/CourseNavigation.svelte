<script lang="ts">
	import type { NavigationItem } from '../types';
	import CourseProgressBar from './CourseProgressBar.svelte';
	import { coursePlayerCopy } from '../course-player-copy';

	interface Props {
		navigationTree: NavigationItem[];
		courseName: string;
		completionPercentage: number;
		completedActivities: number;
		totalActivities: number;
		currentActivityId?: string;
		onNavigate: (activityId: string) => void;
	}

	let {
		navigationTree,
		courseName,
		completionPercentage,
		completedActivities,
		totalActivities,
		currentActivityId,
		onNavigate
	}: Props = $props();

	// Track which sections are expanded
	let expandedSections = $state<Set<string>>(new Set());

	// Expand section containing current activity on mount
	$effect(() => {
		if (currentActivityId) {
			const currentItem = navigationTree.find((item) => item.id === currentActivityId);
			if (currentItem?.sectionId) {
				expandedSections.add(currentItem.sectionId);
			}
		}
	});

	const toggleSection = (sectionId: string) => {
		if (expandedSections.has(sectionId)) {
			expandedSections.delete(sectionId);
		} else {
			expandedSections.add(sectionId);
		}
		expandedSections = new Set(expandedSections);
	};

	const handleActivityClick = (item: NavigationItem) => {
		if (item.type === 'activity' && !item.isLocked) {
			onNavigate(item.id);
		}
	};

	const getActivityIcon = (item: NavigationItem) => {
		if (item.isLocked) return '🔒';
		if (item.isCompleted) return '✓';
		if (item.isCurrent) return '▶';
		return '○';
	};

	const getActivityTypeLabel = (type?: string) => {
		switch (type) {
			case 'scorm': return 'SCORM';
			case 'video': return 'Video';
			case 'document': return 'Document';
			case 'survey': return 'Survey';
			default: return '';
		}
	};
</script>

<nav
	class="h-full bg-white border-r border-gray-200 overflow-y-auto"
	aria-label={coursePlayerCopy.accessibility.navigationMenu}
>
	<!-- Course Title -->
	<div class="p-4 border-b border-gray-200">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">
			{courseName}
		</h2>

		<!-- Overall Progress -->
		<CourseProgressBar
			{completionPercentage}
			{completedActivities}
			{totalActivities}
			size="sm"
		/>
	</div>

	<!-- Navigation Tree -->
	<div class="p-2">
		{#each navigationTree as item}
			{#if item.type === 'section'}
				<!-- Section Header -->
				<button
					type="button"
					onclick={() => toggleSection(item.id)}
					class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
					aria-label={coursePlayerCopy.accessibility.sectionToggle.replace('{{name}}', item.title)}
				>
					<div class="flex items-center gap-2">
						<svg
							class="w-4 h-4 transform transition-transform {expandedSections.has(item.id) ? 'rotate-90' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
						<span class="truncate">{item.title}</span>
					</div>
					{#if item.isCompleted}
						<span class="text-green-600 text-xs">✓</span>
					{/if}
				</button>
			{:else if expandedSections.has(item.sectionId || '')}
				<!-- Activity Item -->
				<button
					type="button"
					onclick={() => handleActivityClick(item)}
					disabled={item.isLocked}
					class="w-full flex items-center gap-3 px-3 py-2 ml-6 text-sm rounded-lg transition-colors
						{item.isCurrent
							? 'bg-blue/10 text-blue font-medium'
							: item.isLocked
								? 'text-gray-400 cursor-not-allowed'
								: 'text-gray-700 hover:bg-gray-50'}"
					aria-label={coursePlayerCopy.accessibility.activityItem
						.replace('{{name}}', item.title)
						.replace('{{status}}', item.isCompleted ? 'completed' : item.isLocked ? 'locked' : 'available')}
				>
					<!-- Icon -->
					<span class="flex-shrink-0 w-5 text-center {item.isCompleted ? 'text-green-600' : item.isCurrent ? 'text-blue' : ''}">
						{getActivityIcon(item)}
					</span>

					<!-- Title -->
					<span class="flex-1 truncate text-left">
						{item.title}
					</span>

					<!-- Type Badge -->
					{#if item.activityType}
						<span class="text-xs text-gray-500 flex-shrink-0">
							{getActivityTypeLabel(item.activityType)}
						</span>
					{/if}
				</button>
			{/if}
		{/each}
	</div>
</nav>
