<script lang="ts">
	import { onMount } from 'svelte';
</script>

<div class="wrapper">
	<input type="checkbox" />
	<div class="fab"></div>
	<div class="fac">
		<div class="w-[10px] bg-[#4285F4] bg-opacity-50 btn">a</div>
		<div class="w-[10px] bg-[#4285F4] bg-opacity-50 btn">b</div>
		<div class="w-[10px] bg-[#4285F4] bg-opacity-50 btn">c</div>
	</div>
</div>

<style>
	:root {
		--background: #4285f4;
		--icon-color: #344955;
		--width: 50px;
		--height: 50px;
		--border-radius: 100%;
	}

	.wrapper {
		width: var(--width);
		height: var(--height);
		position: relative;
		border-radius: var(--border-radius);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 5rem;
	}

	.wrapper .fab {
		background: var(--background);
		width: var(--width);
		height: var(--height);
		position: relative;
		z-index: 3;
		border-radius: var(--border-radius);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		animation: fab-animation-reverse 0.4s ease-out forwards;
	}

	.wrapper .fab::before,
	.wrapper .fab::after {
		content: '';
		display: block;
		position: absolute;
		border-radius: 4px;
		background: #fff;
	}

	.wrapper .fab::before {
		width: 4px;
		height: 18px;
	}

	.wrapper .fab::after {
		width: 18px;
		height: 4px;
	}

	.wrapper .fac {
		width: 32px;
		height: 150px;
		border-radius: 64px;
		position: absolute;
		background: #fff;
		z-index: 2;
		padding: 0.5rem 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		opacity: 0;
		bottom: -110px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		transition:
			opacity 0.2s ease-in,
			bottom 0.2s ease-in,
			width 0.1s ease-in;
	}

	.wrapper .fac div {
		color: var(--icon-color);
		opacity: 0.8;
	}

	.wrapper .fac div:hover {
		transition: 0.2s;
		opacity: 1;
		color: darken(#344955, 2%);
	}

	.wrapper input {
		height: 100%;
		width: 100%;
		border-radius: var(--border-radius);
		cursor: pointer;
		position: absolute;
		z-index: 5;
		opacity: 0;
	}

	.wrapper input:checked ~ .fab {
		animation: fab-animation 0.4s ease-out forwards;
	}

	.wrapper input:checked ~ .fac {
		width: 50px;
		height: 160px;
		animation: fac-animation 0.4s ease-out forwards 0.1s;
		bottom: -170px;
		opacity: 1;
	}

	@keyframes fab-animation {
		0% {
			transform: rotate(0) scale(1);
		}
		20% {
			transform: rotate(60deg) scale(0.93);
		}
		55% {
			transform: rotate(35deg) scale(0.97);
		}
		80% {
			transform: rotate(48deg) scale(0.94);
		}
		100% {
			transform: rotate(45deg) scale(0.95);
		}
	}

	@keyframes fab-animation-reverse {
		0% {
			transform: rotate(45deg) scale(0.95);
		}
		20% {
			transform: rotate(-15deg);
		}
		55% {
			transform: rotate(10deg);
		}
		80% {
			transform: rotate(-3deg);
		}
		100% {
			transform: rotate(0) scale(1);
		}
	}

	@keyframes fac-animation {
		0% {
			transform: scale(1, 1);
		}
		33% {
			transform: scale(0.95, 1.05);
		}
		66% {
			transform: scale(1.05, 0.95);
		}
		100% {
			transform: scale(1, 1);
		}
	}
</style>
