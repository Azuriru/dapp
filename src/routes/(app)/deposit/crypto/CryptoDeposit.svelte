<script lang="ts">
	import FaqCard from '$lib/component/card/FaqCard.svelte';
	import Stepper from '$lib/component/stepper/stepper.svelte';
	import { onMount } from 'svelte';
	// Importing necessary modules and types
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Dropdown from '$lib/component/dropdown/Dropdown.svelte';
	import Spinner from '$lib/component/spinner/spinner.svelte';
	import Success from '$lib/component/success/success.svelte';
	import { showToast } from '$lib/component/toasts/toast';
	import { filterInput, truncateString } from '$lib/helper/helper';
	import { apiWithToken } from '$lib/plugins/http';
	import { broadcastState, sendTransaction } from '$lib/utils/utils';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { Accordion, AccordionItem, clipboard, popup, storePopup } from '@skeletonlabs/skeleton';
	import type { GetBlockNumberErrorType } from 'viem';
	import { t } from '$lib/i18n';
	import { depositFaqList, filterData } from './faqlist';

	// Setting up the popup library
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// Popup settings for click event
	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom'
	};

	let steps = ['Request', 'Confirmation', 'Broadcast', 'Complete'],
		progressBar: any;

	let currentActive: any = 1;

	let coinList: any = [],
		wallet: any,
		selectedCoin: any,
		selectedCoinSetting: any,
		depositAmount: number | string,
		error: any = {
			coin: '',
			input: ''
		};
	let qrCodeSrc: string | null;

	const generateQRCode = (address: any) => {
		qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;
	};

	const handleProgress = (stepIncrement: any) => {
		progressBar.handleProgress(stepIncrement);
	};

	function handleSelectCoin(event: CustomEvent) {
		selectedCoin = event.detail;
		error.coin = '';
	}

	const getCoinList = async () => {
		const resp = await apiWithToken('GET', '/setting/coinList', {
			wallet: wallet
		});
		if (resp.success) {
			coinList = resp.data;
			return (selectedCoin = coinList[0]);
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	const getCoinSetting = async () => {
		const resp = await apiWithToken('GET', '/setting/deposit', {
			coin: selectedCoin.code
		});
		if (resp.success) {
			generateQRCode(resp.data.address);
			return (selectedCoinSetting = resp.data);
		} else {
			for (let i = 0; i < resp.data.length; i++) {
				showToast($t(`common.error.${resp.data[i]}`), 'red');
			}
		}
	};

	$: if (selectedCoin) {
		getCoinSetting();
	}

	const filterAmount = (e: any) => {
		error.input = '';
		const inputValue = filterInput(e);
		return (depositAmount = inputValue);
	};
	const onBroadcast = async () => {
		let txid = await sendTransaction(
			depositAmount,
			'usdt',
			selectedCoinSetting.token_address,
			selectedCoinSetting.address
		);
		if (txid) {
			let resp = await apiWithToken('POST', '/wallet/deposit', {
				setting_deposit_id: selectedCoinSetting.id,
				txid: txid.txid
			});
			console.log(resp);
		}
	};

	$: {
		if (currentActive === 2) {
			if (selectedCoin == undefined) {
				error.coin = 'Please select a coin';
				handleProgress(-1);
			}
			if (depositAmount === '' || depositAmount === undefined) {
				error.input = 'Please enter a valid amount';
				handleProgress(-1);
			} else if (Number(depositAmount) < 0.01) {
				error.input = 'Amount needs to be more than 0.01';
				handleProgress(-1);
			}
		} else if (currentActive == 3) {
			onBroadcast()
				.then(() => {
					handleProgress(+1);
				})
				.catch((e) => {
					const error: any = e as GetBlockNumberErrorType;
					console.log(error);
					if (error.name == 'TransactionExecutionError') {
						showToast($t('common.toast.transaction_rejected'), 'red');
						handleProgress(-1);
					} else if (error.name == 'ContractFunctionExecutionError') {
						showToast($t('common.toast.wallet_not_balance'), 'red');
						handleProgress(-1);
					}
				});
		}
	}

	onMount(async () => {
		wallet = $page.url.searchParams.get('wallet');
		getCoinList();
		if (!wallet) {
			showToast($t('common.toast.wallet_not_found'), 'red');
		}
	});
</script>

<div class="">
	<div class=" mx-auto pt-16 w-[95%] lg:w-full">
		<Stepper {steps} bind:currentActive bind:this={progressBar} />
	</div>

	<div class="{currentActive <= 2 ? 'flex flex-col lg:flex-row gap-4' : ''} ">
		<div
			class="{currentActive <= 2
				? 'lg:w-2/3'
				: 'w-full'} bg-[--card-bg-color] p-5 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700"
		>
			{#if currentActive === 2}
				<p class="text-[#666666] dark:text-white text-[15px] mb-5">
					Please kindly check your deposit information before proceeding.
				</p>
			{/if}
			<!--Deposit Section-->
			<div class="min-h-[50vh] lg:min-h-[45vh]">
				{#if currentActive === 1}
					<div class="space-y-6">
						<div class="coin">
							<!--Select Coin-->
							<div class="dropdown coin-dropdown">
								<h3 class="dark:text-[--font-color] text-[#333333] font-medium">Select Coin</h3>
								<!-- <div class="dark:text-[--font-color] text-[#333333] font-medium text-xl mb-2">Select Coin</div> -->
								<Dropdown
									id="coin"
									items={coinList}
									selectedItem={selectedCoin}
									on:select={handleSelectCoin}
								/>
							</div>
							{#if error.coin}
								<p class="text-red-500 text-sm">{error.coin}</p>
							{/if}
							{#if selectedCoin}
								<span class="ml-1 text-sm">Balance: {Number(selectedCoin.balance).toFixed(4)}</span>
							{/if}
						</div>
						<!-- Deposit -->
						<label class="label">
							<h3 class="dark:text-[--font-color] font-medium">Amount</h3>
							<input
								class="bg-[--input-color] border-[--border-color] w-full rounded-lg"
								bind:value={depositAmount}
								on:input={filterAmount}
								type="text"
								placeholder="Enter your amount..."
							/>
							{#if error.input}
								<p class="text-red-500 text-sm">{error.input}</p>
							{/if}
						</label>
						<div class="network">
							<!--Select Network-->
							<h3 class="dark:text-[--font-color] font-medium">Network</h3>
							<div class="border border-[--border-color] bg-[--input-color] rounded-lg w-full p-3">
								{selectedCoinSetting ? $t(`common.network.${selectedCoinSetting.network}`) : '-'}
							</div>
						</div>
						<Accordion class="bg-[--input-color] rounded-lg ">
							<AccordionItem open class="my-5">
								<svelte:fragment slot="summary"
									><p class="dark:text-[--font-color] font-medium">Address</p></svelte:fragment
								>
								<svelte:fragment slot="content">
									<div class="address my-2">
										<div class="lg:grid lg:grid-cols-2 gap-x-0 lg:gap-x-4">
											<!-- Address Card 1 -->
											<div
												class="shadow-inner px-4 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 flex flex-col lg:flex-row items-center w-full h-full mb-4 lg:mb-0"
											>
												{#if selectedCoinSetting}
													<div
														class="w-[80px] lg:w-[100px] h-[80px] mb-2 lg:mb-0 mt-1 lg:mt-0 bg-white flex items-center justify-center rounded-lg p-1"
													>
														<img src={qrCodeSrc} alt="QR Code" class=" self-center lg:self-auto" />
													</div>
												{/if}

												<!-- Address and Copy Button -->
												<div class="ml-0 lg:ml-4 w-full overflow-hidden text-center lg:text-left">
													<p
														class="dark:text-[--font-color] text-sm font-medium mb-[2px] lg:text-left"
													>
														Address
													</p>

													<!-- Dynamic font size for the address -->
													<h6
														data-clipboard="address"
														class="dark:text-[--font-color] text-sm md:text-base rounded-lg w-full mt-1 py-2"
													>
														{selectedCoinSetting ? selectedCoinSetting.address : '-'}
													</h6>
													{#if selectedCoinSetting}
														<button
															type="button"
															use:clipboard={{ element: 'address' }}
															class="bg-transparent text-sm dark:text-[--font-color] dark:hover:text-[--button-color] hover:text-[--button-color] flex items-center gap-x-1 justify-center lg:justify-start mt-2"
															use:popup={popupClick}
														>
															<Icon icon="lucide:copy" />
															<span>Copy Address</span>
														</button>
														<div
															class="rounded-lg px-2 py-1 bg-[--button-color]"
															data-popup="popupClick"
														>
															<p class="text-sm mb-0">Address Copied</p>
															<div class="arrow pt-2 bg-[--button-color]" />
														</div>
													{/if}
												</div>
											</div>

											<!-- Address Card 2 -->
											<div
												class="shadow-inner px-4 py-4 rounded-lg bg-gray-300 dark:bg-gray-700 w-full h-full flex justify-center overflow-x-auto"
											>
												<table class="w-full dark:text-[--font-color]">
													<tbody>
														<tr>
															<th class="text-left">Minimum Deposit</th>
															<td class="text-right">{selectedCoinSetting ? `0.01 USDT` : '-'}</td>
														</tr>
														<tr>
															<th class="text-left">Confirmation</th>
															<td class="text-right">{selectedCoinSetting ? '15 Blocks' : '-'}</td>
														</tr>
														<tr>
															<th class="text-left">Contract Address</th>
															<td class="text-right">
																{#if selectedCoinSetting}
																	<a
																		class="underline"
																		target="”_blank”"
																		href={`https://bscscan.com/address/${selectedCoinSetting.token_address}`}
																		>{truncateString(selectedCoinSetting.token_address, 5, 5)}</a
																	>
																{:else}
																	-
																{/if}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</svelte:fragment>
							</AccordionItem>
						</Accordion>
					</div>
				{:else if currentActive === 2}
					<div class="space-y-6">
						<div class="coin">
							<!--Select Coin-->
							<div class="dropdown coin-dropdown">
								<h3 class="dark:text-[--font-color] text-[#333333] font-medium">Selected Coin</h3>
								<div class="flex gap-x-2">
									<img
										src="/assets/coinlist/usdt.png"
										alt="coin"
										class="rounded-full w-[20px] h-[20px] mb-1"
									/>
									<p>
										{selectedCoinSetting ? $t(`common.currency.${selectedCoinSetting.coin}`) : '-'}
									</p>
								</div>
							</div>
						</div>
						<div>
							<h3 class="font-medium">Amount to Deposit</h3>
							<p>
								{depositAmount}
								{selectedCoinSetting ? $t(`common.currency.${selectedCoinSetting.coin}`) : '-'}
							</p>
						</div>
						<div>
							<h3 class="font-medium">Network</h3>
							<p>
								{selectedCoinSetting ? $t(`common.network.${selectedCoinSetting.network}`) : '-'}
							</p>
						</div>
						<div class="address my-2">
							<div class="lg:grid lg:grid-cols-2 gap-x-0 lg:gap-x-4">
								<!-- Address Card 1 -->
								<div
									class="shadow-inner px-4 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 flex flex-col lg:flex-row items-center w-full h-full mb-4 lg:mb-0"
								>
									<!-- QR Code -->
									{#if selectedCoinSetting}
										<div
											class="w-[80px] lg:w-[100px] h-[80px] mb-2 lg:mb-0 mt-1 lg:mt-0 bg-white flex items-center justify-center rounded-lg p-1"
										>
											<img src={qrCodeSrc} alt="QR Code" class=" self-center lg:self-auto" />
										</div>
									{/if}

									<!-- Address and Copy Button -->
									<div class="ml-0 lg:ml-4 w-full overflow-hidden text-center lg:text-left">
										<p class="dark:text-[--font-color] text-sm font-medium mb-[2px] lg:text-left">
											Address
										</p>

										<!-- Dynamic font size for the address -->
										<h6
											data-clipboard="address"
											class="dark:text-[--font-color] text-sm md:text-base rounded-lg w-full mt-1 py-2"
										>
											{selectedCoinSetting ? selectedCoinSetting.address : '-'}
										</h6>
										{#if selectedCoinSetting}
											<button
												type="button"
												use:clipboard={{ element: 'address' }}
												class="bg-transparent text-sm dark:text-[--font-color] dark:hover:text-[--button-color] hover:text-[--button-color] flex items-center gap-x-1 justify-center lg:justify-start mt-2"
												use:popup={popupClick}
											>
												<Icon icon="lucide:copy" />
												<span>Copy Address</span>
											</button>
											<div class="rounded-lg px-2 py-1 bg-[--button-color]" data-popup="popupClick">
												<p class="text-sm mb-0">Address Copied</p>
												<div class="arrow pt-2 bg-[--button-color]" />
											</div>
										{/if}
									</div>
								</div>

								<!-- Address Card 2 -->
								<div
									class="shadow-inner px-4 py-4 rounded-lg bg-gray-300 dark:bg-gray-700 w-full h-full flex justify-center overflow-x-auto"
								>
									<table class="w-full dark:text-[--font-color]">
										<tbody>
											<tr>
												<th class="text-left">Minimum Deposit</th>
												<td class="text-right">{selectedCoinSetting ? `0.01 USDT` : '-'}</td>
											</tr>
											<tr>
												<th class="text-left">Confirmation</th>
												<td class="text-right">{selectedCoinSetting ? '15 Blocks' : '-'}</td>
											</tr>
											<tr>
												<th class="text-left">Contract Address</th>
												<td class="text-right"
													>{#if selectedCoinSetting}
														<a
															class="underline"
															target="”_blank”"
															href={`https://bscscan.com/address/${selectedCoinSetting.token_address}`}
															>{truncateString(selectedCoinSetting.token_address, 5, 5)}</a
														>
													{:else}
														-
													{/if}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				{:else if currentActive === 3}
					<div class="flex flex-col items-center justify-center h-[50vh]">
						<p class="text-lg font-medium text-center">{$broadcastState}</p>
						<p class="text-gray-400 text-center">
							Please avoid refreshing the page or clicking any buttons
						</p>
						<div class=" w-full flex items-center justify-center">
							<Spinner />
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center h-[50vh] space-y-6">
						<div class=" w-full flex items-center justify-center">
							<Success />
						</div>
						<div class="flex flex-col items-center">
							<p class="text-xl font-medium">Deposit Sucessful</p>
							<p class="text-gray-400 text-center">
								Your money has been successfully deposited to your account !
							</p>
							<div class="w-full flex justify-center gap-x-5 mt-10">
								<button
									class="btn border rounded-lg"
									on:click={() => goto(`/wallet/details?wallet=${wallet}`)}>My Wallet</button
								>
								<button class="btn border rounded-lg" on:click={() => goto(`/investment`)}
									>Join Investment</button
								>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<!-- Button -->
			<div class="flex mt-5 gap-2 lg:mt-0">
				{#if currentActive > 1 && currentActive <= 2}
					<button
						class="btn border border-gray-400 rounded-lg w-full"
						on:click={() => handleProgress(-1)}
						disabled={currentActive == 1}
					>
						Go Back
					</button>
				{/if}
				{#if currentActive <= 2}
					<button
						class="btn bg-[--button-color] text-white rounded-lg w-full"
						on:click={() => handleProgress(+1)}
						disabled={currentActive == steps.length}
					>
						{currentActive === 1 ? 'Submit' : 'Confirm'}
					</button>
				{/if}
			</div>
		</div>
		{#if currentActive <= 2}
			<!-- FAQ -->
			<div
				class="bg-[--card-bg-color] p-5 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 lg:w-1/3 h-fit"
			>
				<!--FAQ Section-->
				<FaqCard faqList={depositFaqList} />
			</div>
		{/if}
	</div>
</div>
