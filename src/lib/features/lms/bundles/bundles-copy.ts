export const bundlesCopy = {
	page: {
		title: 'Bundles',
		description: 'Course collections organized into modules',
		noBundles: 'No bundles available',
		noResults: 'No bundles found matching your search'
	},

	labels: {
		bundle: 'Bundle',
		bundles: 'Bundles',
		module: 'Module',
		modules: 'Modules',
		course: 'Course',
		courses: 'Courses',
		progress: 'Progress',
		status: 'Status',
		overview: 'Overview',
		details: 'Details'
	},

	progress: {
		notStarted: 'Not Started',
		inProgress: 'In Progress',
		completed: 'Completed',
		completionPercentage: '{{percentage}}% Complete',
		coursesCompleted: '{{completed}} of {{total}} courses completed',
		modulesCompleted: '{{completed}} of {{total}} modules completed',
		currentModule: 'Current: {{moduleName}}',
		nextModule: 'Next: {{moduleName}}'
	},

	actions: {
		startBundle: 'Start Bundle',
		continueBundle: 'Continue Bundle',
		viewBundle: 'View Bundle',
		viewDetails: 'View Details',
		viewModule: 'View Module',
		startCourse: 'Start Course',
		continueCourse: 'Continue Course',
		viewCourse: 'View Course',
		expandModule: 'Expand Module',
		collapseModule: 'Collapse Module',
		expandAll: 'Expand All',
		collapseAll: 'Collapse All'
	},

	modules: {
		moduleList: 'Modules',
		courseCount: '{{count}} course',
		courseCount_plural: '{{count}} courses',
		noModules: 'This bundle has no modules',
		noCourses: 'This module has no courses',
		allCoursesCompleted: 'All courses in this module completed!',
		moduleCompleted: 'Module completed!'
	},

	completion: {
		bundleComplete: 'Congratulations! You have completed this bundle.',
		moduleComplete: 'Module completed! Moving to next module.',
		courseComplete: 'Course completed!',
		allModulesComplete: 'All modules completed!',
		wellDone: 'Well done!',
		keepGoing: 'Keep going!',
		almostThere: 'Almost there!'
	},

	navigation: {
		backToBundle: 'Back to Bundle',
		backToBundles: 'Back to Bundles',
		previousModule: 'Previous Module',
		nextModule: 'Next Module',
		previousCourse: 'Previous Course',
		nextCourse: 'Next Course',
		bundleOverview: 'Bundle Overview',
		moduleList: 'Module List'
	},

	messages: {
		loading: 'Loading bundle...',
		noCoursesInBundle: 'This bundle has no courses yet',
		noModulesInBundle: 'This bundle has no modules yet',
		enrollmentRequired: 'Enroll in this bundle to start learning',
		startFirstModule: 'Start with the first module to begin your learning journey',
		completeModule: 'Complete all courses in this module to proceed'
	},

	errors: {
		loadFailed: 'Failed to load bundle',
		moduleNotFound: 'Module not found in this bundle',
		courseNotFound: 'Course not found in this bundle',
		progressSaveFailed: 'Failed to save progress',
		genericError: 'An error occurred. Please try again.'
	},

	accessibility: {
		bundleCard: 'Bundle card for {{bundleName}}',
		moduleItem: 'Module {{moduleName}}, {{percentage}}% complete',
		courseItem: 'Course {{courseName}}, {{status}}',
		progressBar: 'Progress bar showing {{percentage}}% completion',
		expandButton: 'Expand module {{moduleName}}',
		collapseButton: 'Collapse module {{moduleName}}',
		moduleToggle: 'Toggle module {{moduleName}}'
	},

	stats: {
		totalModules: '{{count}} module',
		totalModules_plural: '{{count}} modules',
		totalCourses: '{{count}} course',
		totalCourses_plural: '{{count}} courses',
		estimatedTime: 'Estimated time: {{time}}',
		difficulty: 'Difficulty: {{level}}',
		enrollmentCount: '{{count}} student enrolled',
		enrollmentCount_plural: '{{count}} students enrolled'
	},

	enrollment: {
		enroll: 'Enroll in Bundle',
		enrolled: 'Enrolled',
		unenroll: 'Unenroll',
		enrollSuccess: 'Successfully enrolled in bundle',
		unenrollSuccess: 'Successfully unenrolled from bundle',
		enrollError: 'Failed to enroll in bundle',
		confirmUnenroll: 'Are you sure you want to unenroll from this bundle?'
	}
};
