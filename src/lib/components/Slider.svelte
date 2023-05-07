<script>
    import RangeSlider from 'svelte-range-slider-pips';

    export let selectedValue;
    export let sliderElements;
    let values;
   
    const updateSelectedValue = () => {
        selectedValue = sliderElements[values[0]];
    }

    $: values && updateSelectedValue();
   
</script>

<RangeSlider pips formatter={ v => sliderElements[v] } max={sliderElements.length-1} bind:values={values}  all='label' />