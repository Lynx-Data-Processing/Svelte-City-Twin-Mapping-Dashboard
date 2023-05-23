<script>
// @ts-nocheck

    // @ts-ignore
    import RangeSlider from 'svelte-range-slider-pips';

    export let selectedValue;
    // @ts-ignore
    export let sliderElements;
    // @ts-ignore
    let values;
   
    const updateSelectedValue = () => {
        // @ts-ignore
        selectedValue = sliderElements[values[0]];
    }

   // @ts-ignore
     $: values && updateSelectedValue();
   
</script>

<RangeSlider pips formatter={ v => sliderElements[v] } max={sliderElements.length-1} bind:values={values}  all='label' />