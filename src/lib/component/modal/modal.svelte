<script lang="ts">
	import Icon from '@iconify/svelte';

	export let showModal: any; // boolean

	let dialog: any; // HTMLDialogElement

	export let closeState: any = false;
	$: if (dialog && showModal) {
		dialog.showModal();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
{#if showModal}
	<dialog
		bind:this={dialog}
		on:close={() => (showModal = false)}
		class="bg-[#191A1A] text-white rounded-2xl z-[500]"
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click|stopPropagation>
			<div class="flex justify-between">
				<slot name="header" />
				<!-- svelte-ignore a11y-autofocus -->
				{#if closeState}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<button
						class=""
						on:click={() => {
							dialog.close();
						}}
					>
						<Icon icon="material-symbols:close" width="25" class="text-gray-400" />
					</button>
				{/if}
			</div>

			<slot />
		</div>
	</dialog>
{/if}

<style>
	dialog {
		max-width: 100rem;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	/* dialog[close] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	} */
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
