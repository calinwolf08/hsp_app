<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { coursePlayerCopy } from '../course-player-copy';

	interface Props {
		canNavigatePrevious: boolean;
		canNavigateNext: boolean;
		currentPosition: number;
		totalActivities: number;
		onPrevious: () => void;
		onNext: () => void;
		onBackToCourse?: () => void;
		showMarkComplete?: boolean;
		isCompleted?: boolean;
		onMarkComplete?: () => void;
	}

	let {
		canNavigatePrevious,
		canNavigateNext,
		currentPosition,
		totalActivities,
		onPrevious,
		onNext,
		onBackToCourse,
		showMarkComplete = false,
		isCompleted = false,
		onMarkComplete
	}: Props = $props();

	const positionText = $derived(
		coursePlayerCopy.progress.currentActivity
			.replace('{{current}}', currentPosition.toString())
			.replace('{{total}}', totalActivities.toString())
	);
</script>

<div class="border-t border-gray-200 bg-white p-4">
	<div class="flex items-center justify-between">
		<!-- Left: Back to Course / Previous -->
		<div class="flex items-center gap-2">
			{#if onBackToCourse}
				<Button variant="outline" size="sm" onclick={onBackToCourse}>
					<svg
						class="w-4 h-4 mr-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					{coursePlayerCopy.navigation.backToCourse}
				</Button>
			{/if}

			<Button
				variant="outline"
				size="sm"
				onclick={onPrevious}
				disabled={!canNavigatePrevious}
				aria-label={coursePlayerCopy.accessibility.navigationButton.replace('{{direction}}', 'Previous')}
			>
				<svg
					class="w-4 h-4 mr-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
				{coursePlayerCopy.navigation.previous}
			</Button>
		</div>

		<!-- Center: Position indicator -->
		<div class="text-sm text-gray-600 font-medium">
			{positionText}
		</div>

		<!-- Right: Mark Complete / Next -->
		<div class="flex items-center gap-2">
			{#if showMarkComplete && onMarkComplete}
				<Button
					variant={isCompleted ? 'outline' : 'primary'}
					size="sm"
					onclick={onMarkComplete}
				>
					{#if isCompleted}
						<svg
							class="w-4 h-4 mr-1"
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
					{:else}
						{coursePlayerCopy.actions.markComplete}
					{/if}
				</Button>
			{/if}

			<Button
				variant="primary"
				size="sm"
				onclick={onNext}
				disabled={!canNavigateNext}
				aria-label={coursePlayerCopy.accessibility.navigationButton.replace('{{direction}}', 'Next')}
			>
				{coursePlayerCopy.navigation.next}
				<svg
					class="w-4 h-4 ml-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</Button>
		</div>
	</div>
</div>
