<script lang="ts">
	import type { Activity, ActivityProgress } from '../../shared/types';
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

	// Get activity type specific content
	const getActivityContent = () => {
		switch (activity.activityType) {
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
</script>

<div class="h-full flex flex-col bg-white">
	<!-- Activity Header -->
	<div class="border-b border-gray-200 p-6">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="flex items-center gap-3 mb-2">
					<span class="text-3xl" role="img" aria-label={activity.activityType}>
						{content.icon}
					</span>
					<div>
						<h1 class="text-2xl font-bold text-gray-900">
							{activity.name}
						</h1>
						<p class="text-sm text-gray-600 mt-1">
							{content.description}
						</p>
					</div>
				</div>

				<!-- Status Badge -->
				{#if isCompleted}
					<div class="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
						<svg
							class="w-4 h-4"
							fill="currentColor"
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
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
	<div class="flex-1 overflow-auto p-6" role="main" aria-label={coursePlayerCopy.accessibility.activityPlayer}>
		{#if content.hasPlayer}
			<!-- Placeholder for activity-specific player -->
			<div class="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
				<div class="text-center p-8">
					<span class="text-6xl mb-4 block">{content.icon}</span>
					<p class="text-lg font-medium text-gray-700 mb-2">
						{activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1)} Player
					</p>
					<p class="text-sm text-gray-500 mb-4">
						Activity player will be loaded here
					</p>
					{#if activity.activityType === 'scorm' && activity.scormFile}
						<p class="text-xs text-gray-400">SCORM Package: {activity.scormFile}</p>
					{:else if activity.activityType === 'video' && activity.videoUrl}
						<p class="text-xs text-gray-400">Video: {activity.videoUrl}</p>
					{:else if activity.activityType === 'document' && activity.documentUrl}
						<p class="text-xs text-gray-400">Document: {activity.documentUrl}</p>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Simple content display for documents -->
			<div class="max-w-4xl mx-auto">
				<div class="prose prose-lg">
					<p class="text-gray-600">
						Activity content will be displayed here.
					</p>
					{#if activity.documentUrl}
						<a
							href={activity.documentUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 text-blue hover:underline"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							{coursePlayerCopy.actions.download}
						</a>
					{/if}
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
							{completing ? coursePlayerCopy.messages.savingProgress : coursePlayerCopy.actions.markComplete}
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
