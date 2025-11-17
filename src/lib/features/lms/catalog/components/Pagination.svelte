<script lang="ts">
	import { catalogCopy } from '../catalog-copy';

	interface Props {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		pageSize: number;
		onPageChange: (page: number) => void;
	}

	let { currentPage, totalPages, totalItems, pageSize, onPageChange }: Props = $props();

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
			scrollToTop();
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
			scrollToTop();
		}
	};

	const handlePageClick = (page: number) => {
		if (page !== currentPage) {
			onPageChange(page);
			scrollToTop();
		}
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Calculate which page numbers to show
	const visiblePages = $derived(() => {
		const pages: (number | 'ellipsis')[] = [];
		const maxVisible = 7; // Show up to 7 page numbers

		if (totalPages <= maxVisible) {
			// Show all pages
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage <= 3) {
				// Near start
				for (let i = 2; i <= 4; i++) {
					pages.push(i);
				}
				pages.push('ellipsis');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				// Near end
				pages.push('ellipsis');
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// Middle
				pages.push('ellipsis');
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i);
				}
				pages.push('ellipsis');
				pages.push(totalPages);
			}
		}

		return pages;
	});

	const startItem = $derived((currentPage - 1) * pageSize + 1);
	const endItem = $derived(Math.min(currentPage * pageSize, totalItems));
</script>

<nav class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6" aria-label={catalogCopy.accessibility.paginationNav}>
	<!-- Showing text -->
	<div class="text-sm text-gray-600">
		Showing {startItem}-{endItem} of {totalItems} courses
	</div>

	<!-- Page controls -->
	<div class="flex items-center gap-2">
		<!-- Previous button -->
		<button
			type="button"
			onclick={handlePrevious}
			disabled={currentPage === 1}
			class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
			aria-label="Go to previous page"
		>
			{catalogCopy.pagination.previous}
		</button>

		<!-- Page numbers -->
		<div class="flex items-center gap-1">
			{#each visiblePages() as page}
				{#if page === 'ellipsis'}
					<span class="px-3 py-2 text-gray-500">...</span>
				{:else}
					<button
						type="button"
						onclick={() => handlePageClick(page)}
						class="px-3 py-2 text-sm font-medium rounded-lg {currentPage === page
							? 'bg-blue text-white'
							: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}"
						aria-label="Go to page {page}"
						aria-current={currentPage === page ? 'page' : undefined}
					>
						{page}
					</button>
				{/if}
			{/each}
		</div>

		<!-- Next button -->
		<button
			type="button"
			onclick={handleNext}
			disabled={currentPage === totalPages}
			class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
			aria-label="Go to next page"
		>
			{catalogCopy.pagination.next}
		</button>
	</div>
</nav>
