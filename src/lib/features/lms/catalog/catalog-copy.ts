export const catalogCopy = {
	page: {
		title: 'Course Catalog',
		description: 'Browse and enroll in available courses',
		noCourses: 'No courses available',
		noResults: 'No courses found matching your search'
	},

	filters: {
		title: 'Filters',
		search: 'Search courses',
		searchPlaceholder: 'Search by name or keyword...',
		categories: 'Categories',
		tags: 'Tags',
		enrollmentStatus: 'Enrollment Status',
		clearAll: 'Clear All Filters',
		apply: 'Apply Filters',
		reset: 'Reset',
		showFilters: 'Show Filters',
		hideFilters: 'Hide Filters',
		activeFilters: '{{count}} active filter',
		activeFilters_plural: '{{count}} active filters'
	},

	enrollmentStatus: {
		all: 'All Courses',
		enrolled: 'Enrolled',
		notEnrolled: 'Not Enrolled'
	},

	sort: {
		label: 'Sort by',
		titleAsc: 'Title (A-Z)',
		titleDesc: 'Title (Z-A)',
		recent: 'Most Recent',
		popular: 'Most Popular'
	},

	actions: {
		enroll: 'Enroll',
		enrolled: 'Enrolled',
		continue: 'Continue Learning',
		unenroll: 'Unenroll',
		viewCourse: 'View Course',
		viewDetails: 'View Details'
	},

	enrollment: {
		success: 'Successfully enrolled in course',
		unenrollSuccess: 'Successfully unenrolled from course',
		error: 'Failed to enroll in course',
		unenrollError: 'Failed to unenroll from course',
		confirmUnenroll: 'Are you sure you want to unenroll from this course?',
		alreadyEnrolled: 'You are already enrolled in this course'
	},

	pagination: {
		previous: 'Previous',
		next: 'Next',
		page: 'Page {{page}} of {{totalPages}}',
		showing: 'Showing {{start}}-{{end}} of {{total}} courses',
		perPage: 'Courses per page',
		goToPage: 'Go to page'
	},

	messages: {
		loading: 'Loading courses...',
		noCoursesAvailable: 'No courses are currently available',
		noMatchingCourses: 'No courses match your filters. Try adjusting your search criteria.',
		enrollmentRequired: 'Enroll in this course to start learning',
		alreadyEnrolled: 'You are enrolled in this course',
		checkBackLater: 'Check back later for new courses'
	},

	errors: {
		loadFailed: 'Failed to load courses',
		enrollmentFailed: 'Failed to process enrollment',
		networkError: 'Network error. Please check your connection.',
		genericError: 'An error occurred. Please try again.'
	},

	accessibility: {
		searchInput: 'Search courses by name or keyword',
		filterButton: 'Toggle filters panel',
		sortSelect: 'Sort courses by',
		enrollButton: 'Enroll in {{courseName}}',
		courseCard: 'Course card for {{courseName}}',
		paginationNav: 'Pagination navigation',
		categoryCheckbox: 'Filter by category {{categoryName}}',
		tagCheckbox: 'Filter by tag {{tagName}}',
		clearFiltersButton: 'Clear all active filters'
	}
};
