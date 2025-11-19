export const activitiesCopy = {
	activityTypes: {
		scorm: 'SCORM Package',
		video: 'Video',
		document: 'Document',
		survey: 'Survey'
	},
	player: {
		controls: {
			play: 'Play',
			pause: 'Pause',
			fullscreen: 'Fullscreen',
			exitFullscreen: 'Exit Fullscreen',
			volume: 'Volume',
			mute: 'Mute',
			unmute: 'Unmute',
			next: 'Next',
			previous: 'Previous',
			close: 'Close',
			restart: 'Restart'
		},
		loading: {
			default: 'Loading activity...',
			scorm: 'Loading SCORM package...',
			video: 'Loading video...',
			document: 'Loading document...',
			survey: 'Loading survey...'
		},
		completion: {
			success: 'Activity completed successfully!',
			failed: 'Activity not completed. Please try again.',
			inProgress: 'Activity in progress...',
			notStarted: 'Click to start the activity'
		}
	},
	scorm: {
		initializing: 'Initializing SCORM player...',
		launching: 'Launching SCORM content...',
		saving: 'Saving your progress...',
		saved: 'Progress saved',
		error: {
			initialization: 'Failed to initialize SCORM package',
			launch: 'Failed to launch SCORM content',
			communication: 'Lost connection to SCORM package',
			save: 'Failed to save progress'
		}
	},
	video: {
		buffering: 'Buffering...',
		ended: 'Video ended',
		error: {
			load: 'Failed to load video',
			playback: 'Video playback error',
			network: 'Network error while loading video'
		}
	},
	document: {
		page: 'Page',
		of: 'of',
		zoom: {
			in: 'Zoom In',
			out: 'Zoom Out',
			fit: 'Fit to Width',
			actual: 'Actual Size'
		},
		error: {
			load: 'Failed to load document',
			render: 'Failed to render page'
		}
	},
	survey: {
		submit: 'Submit Survey',
		submitting: 'Submitting...',
		submitted: 'Survey submitted successfully',
		required: 'This field is required',
		error: {
			load: 'Failed to load survey',
			submit: 'Failed to submit survey'
		}
	},
	errors: {
		general: 'An error occurred while loading the activity',
		unsupported: 'This activity type is not supported',
		unauthorized: 'You do not have access to this activity',
		notFound: 'Activity not found'
	}
};
