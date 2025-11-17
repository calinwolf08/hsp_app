<script lang="ts">
	import { catalogCopy } from '../catalog-copy';

	interface Props {
		value: string;
		onSearch: (value: string) => void;
		placeholder?: string;
	}

	let { value = $bindable(''), onSearch, placeholder = catalogCopy.filters.searchPlaceholder }: Props = $props();

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let inputValue = $state(value);

	// Watch for external value changes
	$effect(() => {
		inputValue = value;
	});

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;

		// Debounce search
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() => {
			value = inputValue;
			onSearch(inputValue);
		}, 300);
	};

	const handleClear = () => {
		inputValue = '';
		value = '';
		onSearch('');
	};
</script>

<div class="relative">
	<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
		<svg
			class="w-5 h-5 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>

	<input
		type="text"
		value={inputValue}
		oninput={handleInput}
		placeholder={placeholder}
		class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
		aria-label={catalogCopy.accessibility.searchInput}
	/>

	{#if inputValue}
		<button
			type="button"
			onclick={handleClear}
			class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
			aria-label="Clear search"
		>
			<svg
				class="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	{/if}
</div>
