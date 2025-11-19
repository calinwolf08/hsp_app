<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { PageSlugs } from '$lib/constants';
	import { goto } from '$app/navigation';

	type Props = {
		user?: {
			id: string;
			email: string;
			name: string;
			image?: string | null;
		};
	};

	let { user }: Props = $props();

	const isAuthenticated = $derived(!!user);
	const currentPath = $derived($page.url.pathname);

	const isActive = (path: string) => {
		if (path === PageSlugs.home) {
			return currentPath === path;
		}
		return currentPath.startsWith(path);
	};

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto(PageSlugs.login);
				}
			}
		});
	};
</script>

<nav class="bg-blue border-b border-dark-grey/20 sticky top-0 z-50">
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo/Brand -->
			<a href={PageSlugs.home} class="flex items-center gap-2">
				<div class="flex size-8 items-center justify-center rounded-lg bg-light-orange">
					<span class="text-lg font-bold text-black">H</span>
				</div>
				<span class="text-xl font-bold text-white">HSP Learning</span>
			</a>

			<!-- Navigation Links -->
			{#if isAuthenticated}
				<div class="flex items-center gap-6">
					<a
						href={PageSlugs.dashboard}
						class="text-sm font-medium transition-colors {isActive(PageSlugs.dashboard)
							? 'text-light-orange'
							: 'text-light-grey hover:text-light-orange'}"
					>
						Dashboard
					</a>
					<a
						href={PageSlugs.catalog}
						class="text-sm font-medium transition-colors {isActive(PageSlugs.catalog)
							? 'text-light-orange'
							: 'text-light-grey hover:text-light-orange'}"
					>
						Catalog
					</a>

					<!-- User Menu -->
					<div class="flex items-center gap-3">
						<div class="hidden text-right sm:block">
							<p class="text-sm font-medium text-white">{user?.name || 'User'}</p>
							<p class="text-xs text-light-grey">{user?.email}</p>
						</div>

						{#if user?.image}
							<img
								src={user.image}
								alt={user.name}
								class="size-10 rounded-full border-2 border-light-orange"
							/>
						{:else}
							<div
								class="flex size-10 items-center justify-center rounded-full border-2 border-light-orange bg-dark-grey text-white"
							>
								{user?.name?.charAt(0).toUpperCase() || 'U'}
							</div>
						{/if}

						<Button variant="ghost" size="sm" onclick={handleLogout} class="text-light-grey">
							Logout
						</Button>
					</div>
				</div>
			{:else}
				<div class="flex items-center gap-4">
					<Button
						variant="ghost"
						size="sm"
						onclick={() => goto(PageSlugs.login)}
						class="text-light-grey hover:text-white"
					>
						Login
					</Button>
				</div>
			{/if}
		</div>
	</div>
</nav>
