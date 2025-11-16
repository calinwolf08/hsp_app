export const dashboardCopy = {
	page: {
		title: 'My Dashboard',
		description: 'Track your learning progress and continue where you left off'
	},
	sections: {
		continueLearning: {
			title: 'Continue Learning',
			description: 'Pick up where you left off',
			emptyState: 'Start a course to see your progress here',
			continueButton: 'Continue Course'
		},
		allCourses: {
			title: 'All Courses',
			description: 'View and manage your enrolled courses'
		},
		stats: {
			title: 'Your Progress',
			totalEnrolled: {
				label: 'Total Enrolled',
				singular: 'Course',
				plural: 'Courses'
			},
			inProgress: {
				label: 'In Progress',
				singular: 'Course',
				plural: 'Courses'
			},
			completed: {
				label: 'Completed',
				singular: 'Course',
				plural: 'Courses'
			},
			notStarted: {
				label: 'Not Started',
				singular: 'Course',
				plural: 'Courses'
			},
			overall: {
				label: 'Overall Progress'
			}
		}
	},
	filters: {
		sort: {
			label: 'Sort by',
			options: {
				recent: 'Recently Accessed',
				title: 'Title (A-Z)',
				progress: 'Progress',
				dueDate: 'Due Date'
			}
		},
		filter: {
			label: 'Filter',
			options: {
				all: 'All Courses',
				'in-progress': 'In Progress',
				completed: 'Completed',
				'not-started': 'Not Started'
			}
		}
	},
	emptyStates: {
		noCourses: {
			title: 'No Courses Enrolled',
			message: 'Browse the course catalog to get started with your learning journey',
			action: 'Browse Courses'
		},
		noFilteredCourses: {
			title: 'No Courses Found',
			message: 'Try adjusting your filters to see more courses',
			action: 'Clear Filters'
		},
		noInProgressCourses: {
			title: 'No Courses In Progress',
			message: 'Start a course to track your learning progress',
			action: 'View All Courses'
		}
	},
	errors: {
		loadingFailed: {
			title: 'Failed to Load Dashboard',
			message: 'There was a problem loading your dashboard. Please try again.',
			action: 'Retry'
		},
		actionFailed: {
			title: 'Action Failed',
			message: 'We couldn\'t complete that action. Please try again.',
			action: 'Dismiss'
		}
	},
	actions: {
		viewCourse: 'View Course',
		continueCourse: 'Continue',
		startCourse: 'Start Course',
		viewAll: 'View All'
	}
};
