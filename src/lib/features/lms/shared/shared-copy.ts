// Shared user-facing text for LMS features

export const sharedCopy = {
	status: {
		notStarted: 'Not Started',
		inProgress: 'In Progress',
		completed: 'Completed'
	},
	enrollmentSource: {
		direct: 'Direct Enrollment',
		bundle: 'Bundle',
		learningPath: 'Learning Path'
	},
	activityType: {
		scorm: 'SCORM',
		survey: 'Survey',
		video: 'Video',
		document: 'Document'
	},
	errors: {
		apiError: 'An error occurred. Please try again.',
		loadingFailed: 'Failed to load content.',
		accessDenied: 'You do not have access to this content.',
		notFound: 'Content not found.',
		networkError: 'Network error. Please check your connection.'
	},
	loading: {
		default: 'Loading...',
		courses: 'Loading courses...',
		progress: 'Loading progress...',
		content: 'Loading content...'
	},
	empty: {
		noCourses: 'No courses available.',
		noProgress: 'No progress yet.',
		noEnrollments: 'No enrollments found.'
	},
	actions: {
		continue: 'Continue',
		start: 'Start',
		resume: 'Resume',
		viewCourse: 'View Course',
		enroll: 'Enroll',
		back: 'Back'
	}
} as const;
