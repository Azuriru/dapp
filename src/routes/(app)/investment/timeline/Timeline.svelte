<div class="timeline">
	<div class="outer">
		<div class="cards">
			<div class="info dark:bg-[#1E2026] bg-white shadow-sm border border-[--border-color]">
				<h3 class="title">Title 1</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</div>
		<div class="cards">
			<div class="info dark:bg-[#1E2026] bg-white shadow-sm border border-[--border-color]">
				<h3 class="title">Title 2</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</div>
		<div class="cards">
			<div class="info dark:bg-[#1E2026] bg-white shadow-sm border border-[--border-color]">
				<h3 class="title">Title 3</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</div>
		<div class="cards">
			<div class="info dark:bg-[#1E2026] bg-white shadow-sm border border-[--border-color]">
				<h3 class="title">Title 4</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</div>
		<div class="cards">
			<div class="info dark:bg-[#1E2026] bg-white shadow-sm border border-[--border-color]">
				<h3 class="title">Title 5</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</div>
		<div class="cards">
			<div class="info dark:bg-[#1E2026] bg-white shadow-sm border border-[--border-color]">
				<h3 class="title">Title 5</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</div>
		<div class="cards">
			<div class="info dark:bg-[#1E2026] bg-white shadow-sm border border-[--border-color]">
				<h3 class="title">Title 5</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</div>
		<div class="cards">
			<div class="info dark:bg-[#1E2026] bg-white shadow-sm border border-[--border-color]">
				<h3 class="title">Title 5</h3>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	/* Card container */
	.cards {
		position: relative;
		background-color: transparent;
		border: none;
	}

	/* setting padding based on even or odd */
	.cards:nth-child(odd) {
		padding: 30px 0 30px 30px;
	}
	.cards:nth-child(even) {
		padding: 30px 30px 30px 0;
	}
	/* Global ::before */
	.cards::before {
		content: '';
		position: absolute;
		width: 50%;
		z-index: 10;
		border: solid var(--button-color);
	}

	/* Setting the border of top, bottom, left */
	.cards:nth-child(odd)::before {
		left: 0px;
		top: -4.5px;
		bottom: -5px;
		border-width: 5px 0 5px 5px;
		border-radius: 50px 0 0 50px;
	}

	/* Setting the border of top, bottom, right */
	.cards:nth-child(even)::before {
		right: 0;
		top: 0;
		bottom: 0;
		border-width: 5px 5px 5px 0;
		border-radius: 0 50px 50px 0;
	}

	/* Removing the border if it is the first cards */
	.cards:first-child::before {
		border-top: 0;
		top: 50px;
		border-top-left-radius: 0;
	}

	/* Removing the border if it is the last cards  and it's odd */
	.cards:last-child:nth-child(odd)::before {
		border-bottom: 0;
		bottom: 100px;
		border-bottom-left-radius: 0;
	}

	/* Removing the border if it is the last cards  and it's even */
	.cards:last-child:nth-child(even)::before {
		border-bottom: 0;
		bottom: 100px;
		border-bottom-right-radius: 0;
	}

	/* Information about the timeline */
	.info {
		display: flex;
		flex-direction: column;
		color: var(--font-gray-color);
		border-radius: 10px;
		padding: 10px;
	}

	/* Title of the cards */
	.title {
		color: var(--button-color);
		position: relative;
	}

	/* Timeline dot  */
	.title::before {
		content: '';
		position: absolute;
		width: 15px;
		height: 15px;
		background: white;
		border-radius: 999px;
		z-index: 10;
		border: 3px solid var(--button-color);
	}

	/* text right if the cards is even  */
	.cards:nth-child(even) > .info > .title {
		text-align: right;
	}

	/* setting dot to the left if the cards is odd */
	.cards:nth-child(odd) > .info > .title::before {
		left: -45px;
	}

	/* setting dot to the right if the cards is odd */
	.cards:nth-child(even) > .info > .title::before {
		right: -45px;
	}

	/* Setting the top and bottom to "-5px" because earlier it was out of a pixel in mobile devices */
	@media only screen and (max-width: 450px) {
		.cards:nth-child(odd)::before {
			top: -5px;
			bottom: -5px;
		}

		.cards:last-child:nth-child(even)::before {
			border-bottom: 0;
			bottom: 200px;
			border-bottom-right-radius: 0;
		}
	}
</style>
