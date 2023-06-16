<script lang="ts">
    export let isLarge = false;
    export let size = 'h-0.5';
    export let isRounded = false
</script>

<hr class="bg-primary {isLarge? "w-24":"w-12"} {size} {isRounded? "rounded-lg" : ""}" />