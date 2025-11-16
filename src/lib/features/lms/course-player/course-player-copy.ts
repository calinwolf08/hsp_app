export const coursePlayerCopy = {
	navigation: {
		next: 'Next',
		previous: 'Previous',
		backToCourse: 'Back to Course',
		backToDashboard: 'Back to Dashboard',
		continue: 'Continue Learning',
		startCourse: 'Start Course',
		resume: 'Resume',
		viewCourse: 'View Course'
	},

	labels: {
		section: 'Section',
		activity: 'Activity',
		course: 'Course',
		progress: 'Progress',
		status: 'Status',
		completed: 'Completed',
		inProgress: 'In Progress',
		notStarted: 'Not Started',
		locked: 'Locked',
		duration: 'Duration',
		activities: 'Activities',
		sections: 'Sections'
	},

	progress: {
		completionPercentage: '{{percentage}}% Complete',
		activitiesCompleted: '{{completed}} of {{total}} activities completed',
		sectionsCompleted: '{{completed}} of {{total}} sections completed',
		currentActivity: 'Activity {{current}} of {{total}}',
		currentSection: 'Section {{current}} of {{total}}'
	},

	completion: {
		activityComplete: 'Activity completed!',
		sectionComplete: 'Section completed!',
		courseComplete: 'Congratulations! You have completed this course.',
		wellDone: 'Well done!',
		keepGoing: 'Keep going!',
		almostThere: 'Almost there!'
	},

	errors: {
		courseNotFound: 'Course not found',
		activityNotFound: 'Activity not found',
		sectionNotFound: 'Section not found',
		notEnrolled: 'You are not enrolled in this course',
		lockedContent: 'This content is locked. Please complete previous activities first.',
		loadFailed: 'Failed to load course content',
		progressSaveFailed: 'Failed to save progress',
		invalidNavigation: 'Invalid navigation request',
		genericError: 'An error occurred. Please try again.'
	},

	messages: {
		loading: 'Loading course...',
		savingProgress: 'Saving progress...',
		noActivities: 'No activities available in this section',
		noSections: 'No sections available in this course',
		enrollRequired: 'Please enroll in this course to access the content',
		completeRequired: 'Complete the previous activity to unlock this one'
	},

	actions: {
		markComplete: 'Mark as Complete',
		markIncomplete: 'Mark as Incomplete',
		retake: 'Retake',
		restart: 'Restart Activity',
		skip: 'Skip',
		viewDetails: 'View Details',
		download: 'Download',
		expand: 'Expand',
		collapse: 'Collapse'
	},

	accessibility: {
		navigationMenu: 'Course navigation menu',
		activityPlayer: 'Activity player',
		progressBar: 'Progress bar showing {{percentage}}% completion',
		completionStatus: 'Completion status: {{status}}',
		navigationButton: '{{direction}} activity',
		sectionToggle: 'Toggle section {{name}}',
		activityItem: 'Activity {{name}}, {{status}}'
	}
};
