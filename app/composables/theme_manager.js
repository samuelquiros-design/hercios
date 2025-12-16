import { ref, computed } from 'vue';

const DOMINANT_TRAIT_KEY = 'dominant_trait';

const palettes = {
    'default': { dark: '#0a0a0a', medium: '#707070', light: '#f4f4f4' },
    'neuroticismo': { dark: '#470b0b', medium: '#ea4747', light: '#fff5f5' },
    'extraversion': { dark: '#471a03', medium: '#f49d1e', light: '#fffbeb' },
    'apertura_experiencia': { dark: '#2b1066', medium: '#8c62f4', light: '#f5f5ff' },
    'amabilidad': { dark: '#03281e', medium: '#0fb773', light: '#ebfff4' },
    'conciencia': { dark: '#172751', medium: '#458df4', light: '#ebf3ff' },
};

const current_dominant_trait = ref('default');

export function use_theme_manager() {

    function theme_dominant_trait(trait_name) {
        if (palettes[trait_name] && trait_name !== current_dominant_trait.value) {
            current_dominant_trait.value = trait_name;
        } else if (!palettes[trait_name] && current_dominant_trait.value !== 'default') {
            current_dominant_trait.value = 'default';
        }
    }

    function initialize_theme_from_storage() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved_trait = localStorage.getItem(DOMINANT_TRAIT_KEY);
            if (saved_trait && palettes[saved_trait]) {
                theme_dominant_trait(saved_trait);
            } else {
                theme_dominant_trait('default');
            }
        }
    }

    const active_palette = computed(() => {
        return palettes[current_dominant_trait.value] || palettes['default'];
    });

    return {
        current_dominant_trait,
        active_palette,
        theme_dominant_trait,
        initialize_theme_from_storage,
        palettes
    };
}