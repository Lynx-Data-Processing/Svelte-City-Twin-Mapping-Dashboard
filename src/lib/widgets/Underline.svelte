<script lang="ts">
    export let color = 'bg-primary';
    export let isLarge = false;
    export let size = 'h-0.5';
    export let isRounded = false
</script>

<hr class="{color} my-1 {isLarge? "w-32":"w-16"} {size} {isRounded? "rounded-lg" : ""}" />