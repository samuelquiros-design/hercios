<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { use_favicon_manager } from '~/composables/favicon_manager';
import { use_scroll_manager } from '~/composables/scroll_manager';
import { use_theme_manager } from '~/composables/theme_manager';

const { reset_scroll_visible, reset_scroll } = use_scroll_manager();
const { current_dominant_trait, initialize_theme_from_storage } = use_theme_manager();

const theme_class = computed(() => {
  return `theme_${current_dominant_trait.value}`;
});

const route = useRoute();
const is_menu_open = ref(false);
const splash_visible = ref(true);

function toggle_menu() {
  is_menu_open.value = !is_menu_open.value;
}

function open_menu() {
  is_menu_open.value = true;
}

function close_menu() {
  is_menu_open.value = false;
}

function navigate_link() {
  close_menu();
  reset_scroll();
}

function animate_splash() {
  setTimeout(() => {
    if (document.readyState === 'complete') {
      splash_visible.value = false;
    } else {
      window.addEventListener('load', () => splash_visible.value = false, { once: true });
    }
  }, 2625);
}

watch(() => route.path, () => {
  close_menu();
});

onMounted(async () => {
  initialize_theme_from_storage();
  use_favicon_manager();
  reset_scroll();
  animate_splash();
  await nextTick();
});
</script>

<template>
  <div class="content_wrapper" :class="theme_class">
    <div class="splash" v-if="splash_visible">
      <span class="splash_text">hercios</span>
    </div>

    <div :class="['overlay', { menu_open: is_menu_open }]" @click="close_menu"></div>

    <button class="scroll_reset" :class="{ visible: reset_scroll_visible }"
      @click="is_menu_open = false; reset_scroll();" :aria-hidden="!reset_scroll_visible" aria-label="Volver arriba">
      <span class="material-symbols-rounded">arrow_upward</span>
    </button>

    <button class="menu_toggle" @click="toggle_menu" @mouseenter="open_menu"
      :aria-label="is_menu_open ? 'Cerrar menú' : 'Abrir menú'">
      <span class="material-symbols-rounded">
        {{ is_menu_open ? 'close' : 'menu' }}
      </span>
    </button>

    <nav class="nav" :class="{ open: is_menu_open }" @mouseleave="close_menu">
      <ul class="nav_list" :class="{ visible: is_menu_open }">
        <li class="nav_list_elem" :class="{ current: route.path === '/' }">
          <NuxtLink to="/" @click="navigate_link">
            <span class="nav_list_elem_tag">Inicio</span>
            <span class="material-symbols-rounded">music_note</span>
          </NuxtLink>
        </li>
        <li class="nav_list_elem" :class="{ current: route.path === '/test' }">
          <NuxtLink to="/test" @click="navigate_link">
            <span class="nav_list_elem_tag">Test</span>
            <span class="material-symbols-rounded">tune</span>
          </NuxtLink>
        </li>
        <li class="nav_list_elem" :class="{ current: route.path.startsWith('/muestras') }">
          <NuxtLink to="/muestras" @click="navigate_link">
            <span class="nav_list_elem_tag">Muestras</span>
            <span class="material-symbols-rounded">blur_on</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <header class="header">
      <div class="header_elements">
        <NuxtLink to="/">
          <span class="header_title">hercios</span>
        </NuxtLink>
      </div>
      <div class="header_waves">
        <svg class="wave wave_1" viewBox="0 0 1000 150">
          <path
            d="M0,150 L0.0,75.0 C 6.3,75.3 18.8,76.0 25.0,76.3 C 31.3,76.6 43.8,77.1 50.0,77.4 C 56.3,77.6 68.8,78.2 75.0,78.4 C 81.3,78.6 93.8,79.0 100.0,79.2 C 106.3,79.4 118.8,79.6 125.0,79.7 C 131.3,79.8 143.8,79.9 150.0,80.0 C 156.3,80.0 168.8,79.9 175.0,79.9 C 181.3,79.8 193.8,79.6 200.0,79.6 C 206.3,79.4 218.8,79.1 225.0,78.9 C 231.3,78.6 243.8,78.2 250.0,78.0 C 256.3,77.8 268.8,77.2 275.0,77.0 C 281.3,76.7 293.8,76.1 300.0,75.8 C 306.3,75.4 318.8,74.7 325.0,74.4 C 331.3,74.1 343.8,73.5 350.0,73.2 C 356.3,73.0 368.8,72.4 375.0,72.2 C 381.3,72.0 393.8,71.5 400.0,71.2 C 406.3,71.1 418.8,70.7 425.0,70.6 C 431.3,70.5 443.8,70.2 450.0,70.1 C 456.3,70.1 468.8,70.0 475.0,70.0 C 481.3,70.1 493.8,70.2 500.0,70.2 C 506.3,70.3 518.8,70.6 525.0,70.7 C 531.3,70.9 543.8,71.3 550.0,71.5 C 556.3,71.8 568.8,72.4 575.0,72.7 C 581.3,73.0 593.8,73.6 600.0,73.9 C 606.3,74.2 618.8,74.9 625.0,75.3 C 631.3,75.6 643.8,76.3 650.0,76.6 C 656.3,76.9 668.8,77.4 675.0,77.7 C 681.3,78.0 693.8,78.5 700.0,78.8 C 706.3,79.0 718.8,79.4 725.0,79.6 C 731.3,79.8 743.8,80.0 750.0,80.2 C 756.3,80.2 768.8,80.4 775.0,80.4 C 781.3,80.4 793.8,80.4 800.0,80.4 C 806.3,80.3 818.8,80.2 825.0,80.1 C 831.3,79.9 843.8,79.6 850.0,79.5 C 856.3,79.2 868.8,78.8 875.0,78.5 C 881.3,78.3 893.8,77.7 900.0,77.4 C 906.3,77.1 918.8,76.5 925.0,76.2 C 931.3,75.9 943.8,75.2 950.0,74.9 C 956.3,74.6 968.8,74.0 975.0,73.7 C 981.3,73.4 993.8,72.8 1000.0,72.5 C 1006.3,72.2 1018.8,71.6 1025.0,71.4 L1000.0,150.0 L0,150.0Z">
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="M0,150 L0.0,75.0 C 6.3,75.3 18.8,76.0 25.0,76.3 C 31.3,76.6 43.8,77.1 50.0,77.4 C 56.3,77.6 68.8,78.2 75.0,78.4 C 81.3,78.6 93.8,79.0 100.0,79.2 C 106.3,79.4 118.8,79.6 125.0,79.7 C 131.3,79.8 143.8,79.9 150.0,80.0 C 156.3,80.0 168.8,79.9 175.0,79.9 C 181.3,79.8 193.8,79.6 200.0,79.6 C 206.3,79.4 218.8,79.1 225.0,78.9 C 231.3,78.6 243.8,78.2 250.0,78.0 C 256.3,77.8 268.8,77.2 275.0,77.0 C 281.3,76.7 293.8,76.1 300.0,75.8 C 306.3,75.4 318.8,74.7 325.0,74.4 C 331.3,74.1 343.8,73.5 350.0,73.2 C 356.3,73.0 368.8,72.4 375.0,72.2 C 381.3,72.0 393.8,71.5 400.0,71.2 C 406.3,71.1 418.8,70.7 425.0,70.6 C 431.3,70.5 443.8,70.2 450.0,70.1 C 456.3,70.1 468.8,70.0 475.0,70.0 C 481.3,70.1 493.8,70.2 500.0,70.2 C 506.3,70.3 518.8,70.6 525.0,70.7 C 531.3,70.9 543.8,71.3 550.0,71.5 C 556.3,71.8 568.8,72.4 575.0,72.7 C 581.3,73.0 593.8,73.6 600.0,73.9 C 606.3,74.2 618.8,74.9 625.0,75.3 C 631.3,75.6 643.8,76.3 650.0,76.6 C 656.3,76.9 668.8,77.4 675.0,77.7 C 681.3,78.0 693.8,78.5 700.0,78.8 C 706.3,79.0 718.8,79.4 725.0,79.6 C 731.3,79.8 743.8,80.0 750.0,80.2 C 756.3,80.2 768.8,80.4 775.0,80.4 C 781.3,80.4 793.8,80.4 800.0,80.4 C 806.3,80.3 818.8,80.2 825.0,80.1 C 831.3,79.9 843.8,79.6 850.0,79.5 C 856.3,79.2 868.8,78.8 875.0,78.5 C 881.3,78.3 893.8,77.7 900.0,77.4 C 906.3,77.1 918.8,76.5 925.0,76.2 C 931.3,75.9 943.8,75.2 950.0,74.9 C 956.3,74.6 968.8,74.0 975.0,73.7 C 981.3,73.4 993.8,72.8 1000.0,72.5 C 1006.3,72.2 1018.8,71.6 1025.0,71.4 L1000.0,150.0 L0,150.0Z; M0,150 L0.0,75.0 C 6.3,74.7 18.8,74.0 25.0,73.7 C 31.3,73.4 43.8,72.9 50.0,72.6 C 56.3,72.4 68.8,71.8 75.0,71.6 C 81.3,71.4 93.8,71.0 100.0,70.8 C 106.3,70.6 118.8,70.4 125.0,70.3 C 131.3,70.2 143.8,70.1 150.0,70.0 C 156.3,70.0 168.8,70.1 175.0,70.1 C 181.3,70.2 193.8,70.4 200.0,70.4 C 206.3,70.6 218.8,70.9 225.0,71.1 C 231.3,71.4 243.8,71.8 250.0,72.0 C 256.3,72.2 268.8,72.8 275.0,73.0 C 281.3,73.3 293.8,73.9 300.0,74.2 C 306.3,74.6 318.8,75.3 325.0,75.6 C 331.3,75.9 343.8,76.5 350.0,76.8 C 356.3,77.0 368.8,77.6 375.0,77.8 C 381.3,78.0 393.8,78.5 400.0,78.8 C 406.3,78.9 418.8,79.3 425.0,79.4 C 431.3,79.5 443.8,79.8 450.0,79.9 C 456.3,79.9 468.8,80.0 475.0,80.0 C 481.3,79.9 493.8,79.8 500.0,79.8 C 506.3,79.7 518.8,79.4 525.0,79.3 C 531.3,79.1 543.8,78.7 550.0,78.5 C 556.3,78.2 568.8,77.6 575.0,77.3 C 581.3,77.0 593.8,76.4 600.0,76.1 C 606.3,75.8 618.8,75.1 625.0,74.7 C 631.3,74.4 643.8,73.7 650.0,73.4 C 656.3,73.1 668.8,72.6 675.0,72.3 C 681.3,72.0 693.8,71.5 700.0,71.2 C 706.3,71.0 718.8,70.6 725.0,70.4 C 731.3,70.2 743.8,70.0 750.0,69.8 C 756.3,69.8 768.8,69.6 775.0,69.6 C 781.3,69.6 793.8,69.6 800.0,69.6 C 806.3,69.7 818.8,69.8 825.0,69.9 C 831.3,70.1 843.8,70.4 850.0,70.5 C 856.3,70.8 868.8,71.2 875.0,71.5 C 881.3,71.7 893.8,72.3 900.0,72.6 C 906.3,72.9 918.8,73.5 925.0,73.8 C 931.3,74.1 943.8,74.8 950.0,75.1 C 956.3,75.4 968.8,76.0 975.0,76.3 C 981.3,76.6 993.8,77.2 1000.0,77.5 C 1006.3,77.8 1018.8,78.4 1025.0,78.6 L1000.0,150.0 L0,150.0Z; M0,150 L0.0,75.0 C 6.3,75.3 18.8,76.0 25.0,76.3 C 31.3,76.6 43.8,77.1 50.0,77.4 C 56.3,77.6 68.8,78.2 75.0,78.4 C 81.3,78.6 93.8,79.0 100.0,79.2 C 106.3,79.4 118.8,79.6 125.0,79.7 C 131.3,79.8 143.8,79.9 150.0,80.0 C 156.3,80.0 168.8,79.9 175.0,79.9 C 181.3,79.8 193.8,79.6 200.0,79.6 C 206.3,79.4 218.8,79.1 225.0,78.9 C 231.3,78.6 243.8,78.2 250.0,78.0 C 256.3,77.8 268.8,77.2 275.0,77.0 C 281.3,76.7 293.8,76.1 300.0,75.8 C 306.3,75.4 318.8,74.7 325.0,74.4 C 331.3,74.1 343.8,73.5 350.0,73.2 C 356.3,73.0 368.8,72.4 375.0,72.2 C 381.3,72.0 393.8,71.5 400.0,71.2 C 406.3,71.1 418.8,70.7 425.0,70.6 C 431.3,70.5 443.8,70.2 450.0,70.1 C 456.3,70.1 468.8,70.0 475.0,70.0 C 481.3,70.1 493.8,70.2 500.0,70.2 C 506.3,70.3 518.8,70.6 525.0,70.7 C 531.3,70.9 543.8,71.3 550.0,71.5 C 556.3,71.8 568.8,72.4 575.0,72.7 C 581.3,73.0 593.8,73.6 600.0,73.9 C 606.3,74.2 618.8,74.9 625.0,75.3 C 631.3,75.6 643.8,76.3 650.0,76.6 C 656.3,76.9 668.8,77.4 675.0,77.7 C 681.3,78.0 693.8,78.5 700.0,78.8 C 706.3,79.0 718.8,79.4 725.0,79.6 C 731.3,79.8 743.8,80.0 750.0,80.2 C 756.3,80.2 768.8,80.4 775.0,80.4 C 781.3,80.4 793.8,80.4 800.0,80.4 C 806.3,80.3 818.8,80.2 825.0,80.1 C 831.3,79.9 843.8,79.6 850.0,79.5 C 856.3,79.2 868.8,78.8 875.0,78.5 C 881.3,78.3 893.8,77.7 900.0,77.4 C 906.3,77.1 918.8,76.5 925.0,76.2 C 931.3,75.9 943.8,75.2 950.0,74.9 C 956.3,74.6 968.8,74.0 975.0,73.7 C 981.3,73.4 993.8,72.8 1000.0,72.5 C 1006.3,72.2 1018.8,71.6 1025.0,71.4 L1000.0,150.0 L0,150.0Z" />
          </path>
        </svg>
        <svg class="wave wave_2" viewBox="0 0 1000 150">
          <path
            d="M0,150 L0.0,75.0 C 6.3,75.3 18.8,76.0 25.0,76.3 C 31.3,76.6 43.8,77.1 50.0,77.4 C 56.3,77.6 68.8,78.2 75.0,78.4 C 81.3,78.6 93.8,79.0 100.0,79.2 C 106.3,79.4 118.8,79.6 125.0,79.7 C 131.3,79.8 143.8,79.9 150.0,80.0 C 156.3,80.0 168.8,79.9 175.0,79.9 C 181.3,79.8 193.8,79.6 200.0,79.6 C 206.3,79.4 218.8,79.1 225.0,78.9 C 231.3,78.6 243.8,78.2 250.0,78.0 C 256.3,77.8 268.8,77.2 275.0,77.0 C 281.3,76.7 293.8,76.1 300.0,75.8 C 306.3,75.4 318.8,74.7 325.0,74.4 C 331.3,74.1 343.8,73.5 350.0,73.2 C 356.3,73.0 368.8,72.4 375.0,72.2 C 381.3,72.0 393.8,71.5 400.0,71.2 C 406.3,71.1 418.8,70.7 425.0,70.6 C 431.3,70.5 443.8,70.2 450.0,70.1 C 456.3,70.1 468.8,70.0 475.0,70.0 C 481.3,70.1 493.8,70.2 500.0,70.2 C 506.3,70.3 518.8,70.6 525.0,70.7 C 531.3,70.9 543.8,71.3 550.0,71.5 C 556.3,71.8 568.8,72.4 575.0,72.7 C 581.3,73.0 593.8,73.6 600.0,73.9 C 606.3,74.2 618.8,74.9 625.0,75.3 C 631.3,75.6 643.8,76.3 650.0,76.6 C 656.3,76.9 668.8,77.4 675.0,77.7 C 681.3,78.0 693.8,78.5 700.0,78.8 C 706.3,79.0 718.8,79.4 725.0,79.6 C 731.3,79.8 743.8,80.0 750.0,80.2 C 756.3,80.2 768.8,80.4 775.0,80.4 C 781.3,80.4 793.8,80.4 800.0,80.4 C 806.3,80.3 818.8,80.2 825.0,80.1 C 831.3,79.9 843.8,79.6 850.0,79.5 C 856.3,79.2 868.8,78.8 875.0,78.5 C 881.3,78.3 893.8,77.7 900.0,77.4 C 906.3,77.1 918.8,76.5 925.0,76.2 C 931.3,75.9 943.8,75.2 950.0,74.9 C 956.3,74.6 968.8,74.0 975.0,73.7 C 981.3,73.4 993.8,72.8 1000.0,72.5 C 1006.3,72.2 1018.8,71.6 1025.0,71.4 L1000.0,150.0 L0,150.0Z">
            <animate attributeName="d" dur="12s" repeatCount="indefinite"
              values="M0,150 L0.0,75.0 C 6.3,75.3 18.8,76.0 25.0,76.3 C 31.3,76.6 43.8,77.1 50.0,77.4 C 56.3,77.6 68.8,78.2 75.0,78.4 C 81.3,78.6 93.8,79.0 100.0,79.2 C 106.3,79.4 118.8,79.6 125.0,79.7 C 131.3,79.8 143.8,79.9 150.0,80.0 C 156.3,80.0 168.8,79.9 175.0,79.9 C 181.3,79.8 193.8,79.6 200.0,79.6 C 206.3,79.4 218.8,79.1 225.0,78.9 C 231.3,78.6 243.8,78.2 250.0,78.0 C 256.3,77.8 268.8,77.2 275.0,77.0 C 281.3,76.7 293.8,76.1 300.0,75.8 C 306.3,75.4 318.8,74.7 325.0,74.4 C 331.3,74.1 343.8,73.5 350.0,73.2 C 356.3,73.0 368.8,72.4 375.0,72.2 C 381.3,72.0 393.8,71.5 400.0,71.2 C 406.3,71.1 418.8,70.7 425.0,70.6 C 431.3,70.5 443.8,70.2 450.0,70.1 C 456.3,70.1 468.8,70.0 475.0,70.0 C 481.3,70.1 493.8,70.2 500.0,70.2 C 506.3,70.3 518.8,70.6 525.0,70.7 C 531.3,70.9 543.8,71.3 550.0,71.5 C 556.3,71.8 568.8,72.4 575.0,72.7 C 581.3,73.0 593.8,73.6 600.0,73.9 C 606.3,74.2 618.8,74.9 625.0,75.3 C 631.3,75.6 643.8,76.3 650.0,76.6 C 656.3,76.9 668.8,77.4 675.0,77.7 C 681.3,78.0 693.8,78.5 700.0,78.8 C 706.3,79.0 718.8,79.4 725.0,79.6 C 731.3,79.8 743.8,80.0 750.0,80.2 C 756.3,80.2 768.8,80.4 775.0,80.4 C 781.3,80.4 793.8,80.4 800.0,80.4 C 806.3,80.3 818.8,80.2 825.0,80.1 C 831.3,79.9 843.8,79.6 850.0,79.5 C 856.3,79.2 868.8,78.8 875.0,78.5 C 881.3,78.3 893.8,77.7 900.0,77.4 C 906.3,77.1 918.8,76.5 925.0,76.2 C 931.3,75.9 943.8,75.2 950.0,74.9 C 956.3,74.6 968.8,74.0 975.0,73.7 C 981.3,73.4 993.8,72.8 1000.0,72.5 C 1006.3,72.2 1018.8,71.6 1025.0,71.4 L1000.0,150.0 L0,150.0Z; M0,150 L0.0,75.0 C 6.3,74.7 18.8,74.0 25.0,73.7 C 31.3,73.4 43.8,72.9 50.0,72.6 C 56.3,72.4 68.8,71.8 75.0,71.6 C 81.3,71.4 93.8,71.0 100.0,70.8 C 106.3,70.6 118.8,70.4 125.0,70.3 C 131.3,70.2 143.8,70.1 150.0,70.0 C 156.3,70.0 168.8,70.1 175.0,70.1 C 181.3,70.2 193.8,70.4 200.0,70.4 C 206.3,70.6 218.8,70.9 225.0,71.1 C 231.3,71.4 243.8,71.8 250.0,72.0 C 256.3,72.2 268.8,72.8 275.0,73.0 C 281.3,73.3 293.8,73.9 300.0,74.2 C 306.3,74.6 318.8,75.3 325.0,75.6 C 331.3,75.9 343.8,76.5 350.0,76.8 C 356.3,77.0 368.8,77.6 375.0,77.8 C 381.3,78.0 393.8,78.5 400.0,78.8 C 406.3,78.9 418.8,79.3 425.0,79.4 C 431.3,79.5 443.8,79.8 450.0,79.9 C 456.3,79.9 468.8,80.0 475.0,80.0 C 481.3,79.9 493.8,79.8 500.0,79.8 C 506.3,79.7 518.8,79.4 525.0,79.3 C 531.3,79.1 543.8,78.7 550.0,78.5 C 556.3,78.2 568.8,77.6 575.0,77.3 C 581.3,77.0 593.8,76.4 600.0,76.1 C 606.3,75.8 618.8,75.1 625.0,74.7 C 631.3,74.4 643.8,73.7 650.0,73.4 C 656.3,73.1 668.8,72.6 675.0,72.3 C 681.3,72.0 693.8,71.5 700.0,71.2 C 706.3,71.0 718.8,70.6 725.0,70.4 C 731.3,70.2 743.8,70.0 750.0,69.8 C 756.3,69.8 768.8,69.6 775.0,69.6 C 781.3,69.6 793.8,69.6 800.0,69.6 C 806.3,69.7 818.8,69.8 825.0,69.9 C 831.3,70.1 843.8,70.4 850.0,70.5 C 856.3,70.8 868.8,71.2 875.0,71.5 C 881.3,71.7 893.8,72.3 900.0,72.6 C 906.3,72.9 918.8,73.5 925.0,73.8 C 931.3,74.1 943.8,74.8 950.0,75.1 C 956.3,75.4 968.8,76.0 975.0,76.3 C 981.3,76.6 993.8,77.2 1000.0,77.5 C 1006.3,77.8 1018.8,78.4 1025.0,78.6 L1000.0,150.0 L0,150.0Z; M0,150 L0.0,75.0 C 6.3,75.3 18.8,76.0 25.0,76.3 C 31.3,76.6 43.8,77.1 50.0,77.4 C 56.3,77.6 68.8,78.2 75.0,78.4 C 81.3,78.6 93.8,79.0 100.0,79.2 C 106.3,79.4 118.8,79.6 125.0,79.7 C 131.3,79.8 143.8,79.9 150.0,80.0 C 156.3,80.0 168.8,79.9 175.0,79.9 C 181.3,79.8 193.8,79.6 200.0,79.6 C 206.3,79.4 218.8,79.1 225.0,78.9 C 231.3,78.6 243.8,78.2 250.0,78.0 C 256.3,77.8 268.8,77.2 275.0,77.0 C 281.3,76.7 293.8,76.1 300.0,75.8 C 306.3,75.4 318.8,74.7 325.0,74.4 C 331.3,74.1 343.8,73.5 350.0,73.2 C 356.3,73.0 368.8,72.4 375.0,72.2 C 381.3,72.0 393.8,71.5 400.0,71.2 C 406.3,71.1 418.8,70.7 425.0,70.6 C 431.3,70.5 443.8,70.2 450.0,70.1 C 456.3,70.1 468.8,70.0 475.0,70.0 C 481.3,70.1 493.8,70.2 500.0,70.2 C 506.3,70.3 518.8,70.6 525.0,70.7 C 531.3,70.9 543.8,71.3 550.0,71.5 C 556.3,71.8 568.8,72.4 575.0,72.7 C 581.3,73.0 593.8,73.6 600.0,73.9 C 606.3,74.2 618.8,74.9 625.0,75.3 C 631.3,75.6 643.8,76.3 650.0,76.6 C 656.3,76.9 668.8,77.4 675.0,77.7 C 681.3,78.0 693.8,78.5 700.0,78.8 C 706.3,79.0 718.8,79.4 725.0,79.6 C 731.3,79.8 743.8,80.0 750.0,80.2 C 756.3,80.2 768.8,80.4 775.0,80.4 C 781.3,80.4 793.8,80.4 800.0,80.4 C 806.3,80.3 818.8,80.2 825.0,80.1 C 831.3,79.9 843.8,79.6 850.0,79.5 C 856.3,79.2 868.8,78.8 875.0,78.5 C 881.3,78.3 893.8,77.7 900.0,77.4 C 906.3,77.1 918.8,76.5 925.0,76.2 C 931.3,75.9 943.8,75.2 950.0,74.9 C 956.3,74.6 968.8,74.0 975.0,73.7 C 981.3,73.4 993.8,72.8 1000.0,72.5 C 1006.3,72.2 1018.8,71.6 1025.0,71.4 L1000.0,150.0 L0,150.0Z" />
          </path>
        </svg>
      </div>
    </header>

    <main class="main">
      <NuxtPage />
    </main>
  </div>
</template>

<style lang="scss">
@use "sass:map";

* {
  transition: fill 4s ease-out, color 4s ease-out, background-color 4s ease-out;
}

.content_wrapper {
  user-select: none;

  --color_dark: #{$color_dark};
  --color_medium: #{$color_medium};
  --color_light: #{$color_light};

  background-color: var(--color_light);
  color: var(--color_dark);

  @each $trait, $colors in $palettes {
    &.theme_#{$trait} {
      $dark: map.get($colors, dark);
      $medium: map.get($colors, medium);
      $light: map.get($colors, light);

      --color_dark: #{$dark};
      --color_medium: #{$medium};
      --color_light: #{$light};
    }
  }

  .splash {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100dvw;
    height: 100dvh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    background-color: var(--color_light);

    .splash_text {
      font-family: 'Parkinsans';
      font-weight: 600;
      font-size: clamp(4rem, 12.5dvw, 8rem);
      color: var(--color_dark);
    }
  }

  .overlay {
    position: fixed;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity .3s ease-in-out;
    z-index: 2;
    background-color: var(--color_dark);

    &.menu_open {
      opacity: .2;
      pointer-events: auto;
    }
  }

  .menu_toggle,
  .scroll_reset {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 1.5rem;
    cursor: pointer;
    z-index: 4;
    background-color: var(--color_dark);
    color: var(--color_light);
    transition: background-color 4s ease-out, color 4s ease-out;

    .material-symbols-rounded {
      font-size: 2rem;
      font-weight: 450;
    }

    @media (hover: hover) {

      &:hover,
      &:active {
        background-color: var(--color_medium);
        transition: background-color 0s;
      }

      &:not(:hover) {
        transition: background-color 0s;
      }
    }
  }

  .menu_toggle {
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
  }

  .scroll_reset {
    position: fixed;
    bottom: .5rem;
    left: .5rem;
    pointer-events: none;
    transform: translateY(150%);
    transition: transform .3s ease-in-out, background-color 4s ease-out, color 4s ease-out;

    &.visible {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
  }

  .nav {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: .5rem .5rem 4rem .5rem;
    gap: .5rem;
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 3;
    transform: translateX(150%);
    pointer-events: none;
    visibility: hidden;
    transition: transform .3s ease-in-out;

    &.open {
      transform: translateX(0);
      pointer-events: auto;
      visibility: visible;
      transition: transform .3s ease-in-out;
    }

    .nav_list {
      display: flex;
      flex-direction: column;
      align-items: end;
      gap: .5rem;
      pointer-events: none;
      transform: translateX(150%);
      transition: all .3s ease-in-out;

      &.visible {
        pointer-events: auto;
        transform: translateX(0);
      }

      .nav_list_elem {
        display: flex;
        justify-content: end;
        width: fit-content;

        a {
          display: flex;
          align-items: center;

          .nav_list_elem_tag {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 3rem;
            padding: 0 3.5rem 0 1rem;
            margin-right: -3rem;
            border-radius: 1.5rem;
            font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
            font-weight: 450;
            background-color: var(--color_light);
            border: 3px solid var(--color_dark);
            transition: background-color 0s, border 0s;
          }

          .material-symbols-rounded {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3rem;
            height: 3rem;
            border-radius: 1.5rem;
            font-size: 2rem;
            font-weight: 450;
            background-color: var(--color_light);
            border: 3px solid var(--color_dark);
            transition: background-color 0s, border 0s;
          }
        }

        @media (hover: hover) {
          &:hover {

            .nav_list_elem_tag,
            .material-symbols-rounded {
              background-color: var(--color_dark);
              color: var(--color_light);
              transition: background-color 0s, color 0s;

            }
          }
        }

        &.current {

          .nav_list_elem_tag,
          .material-symbols-rounded {
            background-color: var(--color_medium);
            border: none;
            color: var(--color_light);
          }
        }
      }
    }
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100dvw;
    position: fixed;
    top: 0;
    font-size: clamp(2.5rem, 5dvw, 3rem);
    z-index: 1;

    .header_elements {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 6rem;
      padding-top: clamp(.5rem, 2.5dvw, 2.5rem);
      z-index: 3;
      background-color: var(--color_dark);

      .header_title {
        font-family: 'Parkinsans';
        font-weight: 600;
        color: var(--color_light);
      }
    }

    .header_waves {
      position: relative;
      width: 100%;
      height: 6rem;
      margin-top: clamp(-4rem, -5dvw, -2rem);

      .wave {
        width: 100%;
        min-width: 640px;
        transform: scale(-1);
        pointer-events: none;

        &.wave_1 {
          position: absolute;
          top: 0;
          z-index: 2;
          fill: var(--color_dark);
        }

        &.wave_2 {
          position: absolute;
          top: .5rem;
          z-index: 1;
          fill: var(--color_medium);
        }
      }
    }
  }

  .main {
    display: flex;
    width: 100dvw;
    height: 100dvh;
    padding-top: 6rem;
  }
}
</style>