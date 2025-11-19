<script lang="ts">
	import type {
		Activity,
		ActivityDepth1,
		ActivityDepth2,
		ActivityProgress,
		ScormFile
	} from '../../shared/types';
	import { isActivityDepth2 } from '../../shared/types/content';
	import { coursePlayerCopy } from '../course-player-copy';

	interface Props {
		activity: Activity;
		progress: ActivityProgress | null;
		onComplete?: () => Promise<void>;
	}

	let { activity, progress, onComplete }: Props = $props();

	let completing = $state(false);

	const handleMarkComplete = async () => {
		if (!onComplete || completing) return;

		completing = true;
		try {
			await onComplete();
		} catch (err) {
			console.error('Failed to mark activity complete:', err);
			alert(coursePlayerCopy.errors.progressSaveFailed);
		} finally {
			completing = false;
		}
	};

	const isCompleted = $derived(progress?.status === 'completed');

	// Check if activity has populated ScormFile
	const scormFile = $derived<ScormFile | null>(() => {
		if (!isActivityDepth2(activity)) {
			return null;
		}
		return typeof activity.ScormFile === 'object' ? activity.ScormFile : null;
	});

	// Get activity type - for now, all activities are SCORM
	const activityType = 'scorm';

	// Get activity type specific content
	const getActivityContent = () => {
		switch (activityType) {
			case 'scorm':
				return {
					icon: '📚',
					description: 'Interactive SCORM content',
					hasPlayer: true
				};
			case 'video':
				return {
					icon: '🎥',
					description: 'Video content',
					hasPlayer: true
				};
			case 'document':
				return {
					icon: '📄',
					description: 'Document content',
					hasPlayer: false
				};
			case 'survey':
				return {
					icon: '📋',
					description: 'Survey or assessment',
					hasPlayer: true
				};
			default:
				return {
					icon: '📖',
					description: 'Learning content',
					hasPlayer: false
				};
		}
	};

	const content = $derived(getActivityContent());

	// Get activity name
	const activityName = $derived(() => {
		if (typeof activity === 'number') {
			return `Activity ${activity}`;
		}
		return activity.name;
	});
</script>

<div class="h-full flex flex-col bg-white">
	<!-- Activity Header -->
	<div class="border-b border-gray-200 p-6">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-2">
					<span class="text-3xl" role="img" aria-label={activityType}>
						{content.icon}
					</span>
					<div>
						<h1 class="text-2xl font-bold text-gray-900">
							{activityName}
						</h1>
						<p class="text-sm text-gray-600 mt-1">
							{content.description}
						</p>
					</div>
				</div>

				<!-- Status Badge -->
				{#if isCompleted}
					<div
						class="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						{coursePlayerCopy.labels.completed}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Activity Content Area -->
	<div
		class="flex-1 overflow-auto p-6"
		role="main"
		aria-label={coursePlayerCopy.accessibility.activityPlayer}
	>
		{#if content.hasPlayer}
			<!-- SCORM Player -->
			{#if activityType === 'scorm' && scormFile}
				<div class="h-full w-full">
					<iframe
						src={scormFile.extractedPath}
						title={activityName}
						class="w-full h-full border-0 rounded-lg"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
					></iframe>
				</div>
			{:else}
				<!-- Placeholder for other activity types or when SCORM not loaded -->
				<div
					class="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
				>
					<div class="text-center p-8">
						<span class="text-6xl mb-4 block">{content.icon}</span>
						<p class="text-lg font-medium text-gray-700 mb-2">
							{activityType.charAt(0).toUpperCase() + activityType.slice(1)} Player
						</p>
						<p class="text-sm text-gray-500 mb-4">Activity player will be loaded here</p>
						{#if !scormFile}
							<p class="text-xs text-gray-400">Loading SCORM content...</p>
						{/if}
					</div>
				</div>
			{/if}
		{:else}
			<!-- Simple content display for documents -->
			<div class="max-w-4xl mx-auto">
				<div class="prose prose-lg">
					<p class="text-gray-600">Activity content will be displayed here.</p>
				</div>

				{#if !isCompleted}
					<div class="mt-8 p-4 bg-blue/10 border border-blue/20 rounded-lg">
						<p class="text-sm text-gray-700 mb-3">
							Review the content above, then mark this activity as complete to continue.
						</p>
						<button
							type="button"
							onclick={handleMarkComplete}
							disabled={completing}
							class="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{completing
								? coursePlayerCopy.messages.savingProgress
								: coursePlayerCopy.actions.markComplete}
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
