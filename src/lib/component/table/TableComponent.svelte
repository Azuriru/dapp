<script lang="ts">
    export let headers: string[] = [];
    export let rows: any[][] = [];

    // Function to check if a cell contains an <img> tag
    function containsImage(cellContent: string): boolean {
        return cellContent.includes('<img');
    }
</script>


<div class="flex overflow-x-auto rounded-xl overflow-hidden shadow-xl">
    <table class="w-[1300px] text-left text-sm font-light bg-[--font-color] dark:bg-[--dark-bg]">
        <thead class="border-b font-medium dark:border-neutral-500 dark:text-[--font-color] bg-[--light-table-header] dark:bg-[--light-bg]">
            <tr>
                {#each headers as header}
                    <th scope="col" class="px-6 py-4">{header}</th>
                {/each}
            </tr>
        </thead>
        <tbody>                     
            {#each rows as row}
                <tr class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 hover:bg-[--light-table-hover] dark:hover:bg-[--hover-bg]">
                    {#each row as cell}
                        <td class:first-column={containsImage(cell)} class="whitespace-nowrap px-6 py-4">{@html cell}</td>
                    {/each}
                </tr>
            {/each}   
        </tbody>
    </table>
</div>


<style>
    .first-column {
        display: flex;
        align-items: center;
        font-weight: 500;
    }
</style>