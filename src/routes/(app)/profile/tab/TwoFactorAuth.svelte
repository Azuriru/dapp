<script>

	import Icon from "@iconify/svelte";

</script>
<div class="w-full flex flex-col items-center space-y-10 lg:pb-10">
    <div class="w-full flex justify-between items-center">
        <div>
            <p class="text-lg">2 Factor Auth</p>
            <p class="text-[--font-gray-color] text-xs">
                Secure your account with higher protection!
            </p>
        </div>
    </div>

    <div class="flex flex-col items-center w-full lg:w-[70%] space-y-10 lg:space-y-5">
        <div class="flex flex-col lg:flex-row w-full gap-5">
            <div
                class="flex flex-col justify-center items-center lg:w-[50%] text-center bg-[--card-bg-color] shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg h-[350px] p-5 gap-y-5"
            >
                <div class="flex flex-col justify-center">
                    <Icon icon="flat-color-icons:sms" class="text-[80px]" />
                    <p class="text-xl font-medium">With SMS</p>
                </div>

                <p class="text-sm text-[--font-gray-color]">
                    We will send you an SMS with the code on your mobile phone
                </p>
            </div>
            <div class="w-full p-5 space-y-5">
                <div>
                    <p class="text-lg">Enter your Phone Number</p>
                    <p class="text-[--font-gray-color] text-sm">
                        Enter the required information to continue
                    </p>
                </div>
                <input
                    type="text"
                    class="border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-[#131B2E] rounded-lg w-full h-[60px]"
                    placeholder="Ex: +65 8888 9999"
                />

                <button class="btn rounded-lg bg-[--button-color] text-white w-full">
                    Continue
                </button>
            </div>
        </div>
    </div>
</div>