<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Scorm12API from 'scorm-again/src/Scorm12API';
	import type { ScormFile } from '../../shared/types';

	interface Props {
		scormFile: ScormFile;
		activityId: number;
		userId: string;
		initialScormData?: object | null;
		onProgressUpdate?: (scormData: object) => Promise<void>;
		onComplete?: () => Promise<void>;
	}

	let {
		scormFile,
		activityId,
		userId,
		initialScormData = null,
		onProgressUpdate,
		onComplete
	}: Props = $props();

	let iframeElement: HTMLIFrameElement | undefined = $state();
	let scormAPI: Scorm12API | null = $state(null);
	let isInitialized = $state(false);
	let lastSaveTime = $state(0);
	let saveInterval: number | null = null;

	// Auto-save interval (30 seconds)
	const AUTO_SAVE_INTERVAL = 30000;

	/**
	 * Initialize SCORM API
	 */
	const initializeScormAPI = () => {
		// Create SCORM 1.2 API instance
		const api = new Scorm12API({
			logLevel: 4, // Debug level
			autocommit: false, // We'll handle commits manually
			autocommitSeconds: 0,
			strictCallbacks: false
		});

		// Load previous SCORM data if available
		if (initialScormData) {
			try {
				api.loadFromJSON(initialScormData);
				console.log('[SCORM] Loaded previous progress data');
			} catch (err) {
				console.error('[SCORM] Failed to load previous data:', err);
			}
		}

		// Listen for SCORM events
		api.on('LMSInitialize', () => {
			console.log('[SCORM] LMSInitialize called');
			isInitialized = true;
		});

		api.on('LMSFinish', async () => {
			console.log('[SCORM] LMSFinish called');
			await handleSaveProgress();
			isInitialized = false;
		});

		api.on('LMSCommit', async () => {
			console.log('[SCORM] LMSCommit called');
			await handleSaveProgress();
		});

		api.on('LMSSetValue', (cmi: string, value: string) => {
			console.log(`[SCORM] LMSSetValue: ${cmi} = ${value}`);

			// Check for completion
			if (cmi === 'cmi.core.lesson_status' && (value === 'completed' || value === 'passed')) {
				console.log('[SCORM] Activity completed!');
				handleCompletion();
			}

			// Check for score
			if (cmi === 'cmi.core.score.raw') {
				console.log(`[SCORM] Score updated: ${value}`);
			}
		});

		// Expose API to iframe window
		if (typeof window !== 'undefined') {
			(window as any).API = api;
		}

		scormAPI = api;
		console.log('[SCORM] API initialized');
	};

	/**
	 * Handle completion event
	 */
	const handleCompletion = async () => {
		console.log('[SCORM] Handling completion...');
		await handleSaveProgress();
		if (onComplete) {
			try {
				await onComplete();
			} catch (err) {
				console.error('[SCORM] Error in onComplete callback:', err);
			}
		}
	};

	/**
	 * Save SCORM progress to database
	 */
	const handleSaveProgress = async () => {
		if (!scormAPI || !onProgressUpdate) return;

		try {
			// Get current SCORM data
			const scormData = scormAPI.renderCommitCMI(true);

			console.log('[SCORM] Saving progress...', scormData);

			// Call progress update callback
			await onProgressUpdate(scormData);

			lastSaveTime = Date.now();
			console.log('[SCORM] Progress saved successfully');
		} catch (err) {
			console.error('[SCORM] Failed to save progress:', err);
		}
	};

	/**
	 * Setup auto-save interval
	 */
	const setupAutoSave = () => {
		saveInterval = window.setInterval(() => {
			if (isInitialized && scormAPI) {
				console.log('[SCORM] Auto-saving progress...');
				handleSaveProgress();
			}
		}, AUTO_SAVE_INTERVAL);
	};

	/**
	 * Cleanup
	 */
	const cleanup = () => {
		if (saveInterval) {
			clearInterval(saveInterval);
			saveInterval = null;
		}

		// Final save before cleanup
		if (isInitialized && scormAPI) {
			handleSaveProgress();
		}

		// Remove API from window
		if (typeof window !== 'undefined') {
			delete (window as any).API;
		}

		scormAPI = null;
		isInitialized = false;
	};

	onMount(() => {
		initializeScormAPI();
		setupAutoSave();
	});

	onDestroy(() => {
		cleanup();
	});
</script>

<div class="h-full w-full relative">
	{#if !isInitialized}
		<div
			class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 pointer-events-none"
		>
			<div class="text-center">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
				<p class="mt-2 text-sm text-gray-600">Initializing SCORM player...</p>
			</div>
		</div>
	{/if}

	<iframe
		bind:this={iframeElement}
		src={scormFile.extractedPath}
		title="SCORM Content"
		class="w-full h-full border-0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation"
	></iframe>

	<!-- Debug info (only in development) -->
	{#if import.meta.env.DEV}
		<div class="absolute bottom-2 right-2 bg-black/75 text-white text-xs p-2 rounded max-w-xs">
			<div>Status: {isInitialized ? 'Initialized' : 'Not initialized'}</div>
			<div>Activity ID: {activityId}</div>
			<div>Last Save: {lastSaveTime ? new Date(lastSaveTime).toLocaleTimeString() : 'Never'}</div>
		</div>
	{/if}
</div>
