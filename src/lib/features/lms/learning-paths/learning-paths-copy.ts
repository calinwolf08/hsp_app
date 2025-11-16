export const learningPathsCopy = {
	page: {
		title: 'Learning Paths',
		description: 'Structured learning journeys to master new skills',
		noPaths: 'No learning paths available',
		noResults: 'No learning paths found matching your search'
	},

	labels: {
		learningPath: 'Learning Path',
		bundle: 'Bundle',
		module: 'Module',
		course: 'Course',
		courses: 'Courses',
		bundles: 'Bundles',
		modules: 'Modules',
		progress: 'Progress',
		status: 'Status',
		accessType: 'Access Type',
		sequential: 'Sequential',
		automatic: 'Automatic',
		locked: 'Locked',
		unlocked: 'Unlocked'
	},

	accessType: {
		sequential: 'Sequential',
		sequentialDescription: 'Complete courses in order',
		automatic: 'Automatic',
		automaticDescription: 'Access all courses immediately'
	},

	progress: {
		notStarted: 'Not Started',
		inProgress: 'In Progress',
		completed: 'Completed',
		completionPercentage: '{{percentage}}% Complete',
		coursesCompleted: '{{completed}} of {{total}} courses completed',
		currentCourse: 'Current: {{courseName}}',
		nextCourse: 'Next: {{courseName}}',
		allCoursesCompleted: 'All courses completed!'
	},

	actions: {
		startPath: 'Start Learning Path',
		continuePath: 'Continue Learning Path',
		viewPath: 'View Learning Path',
		viewDetails: 'View Details',
		startCourse: 'Start Course',
		continueCourse: 'Continue Course',
		viewCourse: 'View Course',
		unlock: 'Unlock',
		expandAll: 'Expand All',
		collapseAll: 'Collapse All'
	},

	sequential: {
		lockedMessage: 'Complete previous course to unlock',
		unlockProgress: 'Complete "{{courseName}}" to unlock this course',
		currentCourseMessage: 'You are currently on this course',
		nextCourseMessage: 'This is your next course',
		completePreviousMessage: 'Complete the previous course first',
		sequentialOrderMessage: 'Courses must be completed in order'
	},

	completion: {
		pathComplete: 'Congratulations! You have completed this learning path.',
		courseComplete: 'Course completed! Moving to next course.',
		bundleComplete: 'Bundle completed!',
		moduleComplete: 'Module completed!',
		wellDone: 'Well done!',
		keepGoing: 'Keep going!',
		almostThere: 'Almost there!',
		oneMoreCourse: 'Just one more course to go!'
	},

	navigation: {
		backToPath: 'Back to Learning Path',
		backToPaths: 'Back to Learning Paths',
		previousCourse: 'Previous Course',
		nextCourse: 'Next Course',
		pathOverview: 'Path Overview',
		courseList: 'Course List'
	},

	messages: {
		loading: 'Loading learning path...',
		noCoursesInPath: 'This learning path has no courses yet',
		noBundlesInPath: 'This learning path has no bundles yet',
		enrollmentRequired: 'Enroll in this learning path to start learning',
		sequentialAccessInfo: 'This learning path uses sequential access. Complete courses in order.',
		automaticAccessInfo: 'This learning path allows automatic access. Start any course!'
	},

	errors: {
		loadFailed: 'Failed to load learning path',
		courseNotFound: 'Course not found in this learning path',
		accessDenied: 'You do not have access to this course',
		lockedCourse: 'This course is locked. Complete previous courses first.',
		progressSaveFailed: 'Failed to save progress',
		genericError: 'An error occurred. Please try again.'
	},

	accessibility: {
		pathCard: 'Learning path card for {{pathName}}',
		courseItem: 'Course {{courseName}}, {{status}}',
		lockedCourse: 'Course {{courseName}} is locked',
		completedCourse: 'Course {{courseName}} is completed',
		currentCourse: 'Current course: {{courseName}}',
		progressBar: 'Progress bar showing {{percentage}}% completion',
		expandButton: 'Expand {{itemName}}',
		collapseButton: 'Collapse {{itemName}}'
	},

	stats: {
		totalCourses: '{{count}} course',
		totalCourses_plural: '{{count}} courses',
		totalBundles: '{{count}} bundle',
		totalBundles_plural: '{{count}} bundles',
		totalModules: '{{count}} module',
		totalModules_plural: '{{count}} modules',
		estimatedTime: 'Estimated time: {{time}}',
		difficulty: 'Difficulty: {{level}}'
	}
};
