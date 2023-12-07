<script>
	import Icon from '@iconify/svelte';
</script>

<div class="flex flex-col lg:flex-row gap-5 my-5 w-full">
	<div class="bg-[--card-bg-color] rounded-lg border border-[--border-color] lg:w-2/3 shadow-xl ">
		<div class=" flex items-center justify-between p-5 border-b border-[--border-color]">
			<div>
				<p class="font-bold">Payment Method</p>
				<p class="text-sm text-[--font-gray-color]">Select a payment method.</p>
			</div>
			<p class="text-[--font-gray-color]">1 Option</p>
		</div>
		<div class="bg-[--input-color] flex gap-x-2 text-sm items-center p-5">
			<input class="radio" type="radio" checked name="radio-direct" value="1" />
			<p>Credit Card / Debit Card</p>
		</div>
		<div class="flex flex-col lg:flex-row gap-5 justify-between p-5">
			<div class="lg:w-1/2 space-y-1 flex flex-col justify-center">
				<p>Deposit with MasterCard</p>
				<p class="text-[--font-gray-color] text-sm">
					After clicking on "Deposit", you will be redirected to our payment gateway to complete
					your deposit securely.
				</p>
			</div>
			<div class="lg:w-1/2 flex flex-col items-end justify-center">
				<!-- credit card -->
				<div class="w-full lg:w-[90%] bg-[--input-color] shadow-lg p-4 rounded-lg">
					<div class="flex items-center justify-between">
						<p class="text-[--font-gray-color]">MasterCard</p>
						<Icon icon="lucide:nfc" class="text-[--font-gray-color] text-xl" />
					</div>
					<div class="">
						<img src="/assets/img/deposit/chip.svg" class="w-[45px] my-3" alt="" />
						<p class="text-lg text-[--font-gray-color]">**** **** **** ****</p>
						<div class="flex items-center justify-between">
							<div class="flex gap-x-5 text-xs text-[--font-gray-color]">
								<p>EXP ** / ***</p>
								<p>CVC ***</p>
							</div>
							<div class="flex">
								<div
									class="bg-red-500 w-[30px] h-[30px] rounded-full translate-x-4 bg-opacity-50"
								></div>
								<div class="bg-yellow-500 w-[30px] h-[30px] rounded-full bg-opacity-50"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="bg-[--card-bg-color] rounded-lg border border-[--border-color] lg:w-1/3 shadow-xl ">
		<div class=" p-5 border-b border-[--border-color]">
			<p class="text-[--font-gray-color]">Deposit Amount</p>
			<input
				type="text"
				class="bg-[--input-color] rounded-lg border-[--border-color] w-full dark:placeholder:text-gray-500 placeholder:text-gray-400"
				placeholder="Enter Amount"
			/>
			<div class="flex justify-between my-2">
				<p>Flat Tax</p>
				<p class="font-semibold">USD 1</p>
			</div>
			<div class="flex justify-between">
				<p>Percentage Tax</p>
				<p class="font-semibold">3%</p>
			</div>
		</div>
		<div class="p-5">
			<div class="flex justify-between">
				<p>Amount To Pay</p>
				<p class="font-semibold">USD 1</p>
			</div>
			<p class="text-[--font-gray-color] mt-2 mb-5">
				Taxes are calculated at a flat rate of 3% ,plus a fixed fee of MYR 1. This amount has been
				included in your total.
			</p>
			<button class="btn bg-[--button-color] rounded-lg w-full text-white"> Deposit </button>
		</div>
	</div>
</div>
