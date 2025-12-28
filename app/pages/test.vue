<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { use_scroll_manager } from '~/composables/scroll_manager';
import { use_theme_manager } from '~/composables/theme_manager';

const { reset_scroll } = use_scroll_manager();
const { theme_dominant_trait } = use_theme_manager();

const TEST_STORAGE_KEY = 'test_scores';
const STATUS_STORAGE_KEY = 'test_status';
const DOMINANT_TRAIT_KEY = 'dominant_trait';
const ORDER_STORAGE_KEY = 'test_order';

const audio_player = ref(null);
const video_player = ref(null);
const is_video_muted = ref(true);

const current_dominant_trait = ref('');

const safe_parse = (data) => {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("Error al cargar almacenamiento local. Se usarán los valores por defecto.", e);
        return null;
    }
}

const shuffle_array = (array) => {
    let current_index = array.length, random_index;

    while (current_index != 0) {
        random_index = Math.floor(Math.random() * current_index);
        current_index--;

        [array[current_index], array[random_index]] = [
            array[random_index], array[current_index]];
    }
    return array;
}

const questions_data = [
    { id: "01", text: "Con frecuencia me preocupo, incluso sin una razón clara.", category: "neuroticismo", score: 1 },
    { id: "02", text: "Me resulta difícil controlar mis impulsos.", category: "neuroticismo", score: 1 },
    { id: "03", text: "Tiendo a ver el lado negativo de las cosas.", category: "neuroticismo", score: 1 },
    { id: "04", text: "Suelo enfadarme con facilidad si las cosas no salen como quiero.", category: "neuroticismo", score: 1 },
    { id: "05", text: "Cuando me estreso, me desmorono rápidamente.", category: "neuroticismo", score: 1 },

    { id: "06", text: "Disfruto estar en entornos con mucha gente.", category: "extraversion", score: 1 },
    { id: "07", text: "A menudo soy quien inicia las conversaciones en un grupo.", category: "extraversion", score: 1 },
    { id: "08", text: "Me siento con energía tras pasar tiempo en situaciones sociales.", category: "extraversion", score: 1 },
    { id: "09", text: "Considero que soy una persona alegre y optimista.", category: "extraversion", score: 1 },
    { id: "10", text: "En una reunión, suelo mostrar proactividad para interactuar con la gente.", category: "extraversion", score: 1 },

    { id: "11", text: "Disfruto explorando ideas abstractas y complejas.", category: "apertura_experiencia", score: 1 },
    { id: "12", text: "Tengo una gran apreciación por el arte.", category: "apertura_experiencia", score: 1 },
    { id: "13", text: "Suelo cuestionar la autoridad y las reglas si no estoy de acuerdo.", category: "apertura_experiencia", score: 1 },
    { id: "14", text: "Me gusta probar cosas nuevas en lugar de seguir la rutina.", category: "apertura_experiencia", score: 1 },
    { id: "15", text: "Me considero una persona con gran creatividad e imaginación.", category: "apertura_experiencia", score: 1 },

    { id: "16", text: "Suelo confiar en las personas, incluso si no las conozco demasiado.", category: "amabilidad", score: 1 },
    { id: "17", text: "Me resulta fácil ponerme en el lugar de los demás.", category: "amabilidad", score: 1 },
    { id: "18", text: "Prefiero ceder en lugar de discutir para evitar conflictos.", category: "amabilidad", score: 1 },
    { id: "19", text: "Me considero una persona sincera.", category: "amabilidad", score: 1 },
    { id: "20", text: "No me considero mejor que la mayoría de las personas.", category: "amabilidad", score: 1 },

    { id: "21", text: "Soy una persona organizada y me gusta tener mis cosas en orden.", category: "conciencia", score: 1 },
    { id: "22", text: "Siempre me aseguro de cumplir con mis responsabilidades.", category: "conciencia", score: 1 },
    { id: "23", text: "Trabajo de forma metódica para lograr mis objetivos.", category: "conciencia", score: 1 },
    { id: "24", text: "Me considero competente y capaz de manejar situaciones complejas.", category: "conciencia", score: 1 },
    { id: "25", text: "Antes de tomar una decisión importante, pienso en las posibles consecuencias.", category: "conciencia", score: 1 },
];

const questions = ref([]);
const show_results = ref(false);
const test_completed = ref(false);

const get_audio_file = (category, score) => {
    let note_letter = '';

    switch (category) {
        case 'neuroticismo':
            note_letter = 'B';
            break;
        case 'extraversion':
            note_letter = 'A';
            break;
        case 'apertura_experiencia':
            note_letter = 'E';
            break;
        case 'amabilidad':
            note_letter = 'D';
            break;
        case 'conciencia':
            note_letter = 'F';
            break;
        default:
            return null;
    }

    let note_number;
    switch (score) {
        case 1:
            note_number = '3';
            break;
        case 2:
        case 3:
            note_number = '4';
            break;
        case 4:
            note_number = '5';
            break;
        default:
            return null;
    }

    return `Slider${note_letter}${note_number}.mp3`;
};

const play_sound = (score, id) => {
    if (!audio_player.value) return;

    const question = questions.value.find(q => q.id === id);
    if (!question) return;

    const audio_file_name = get_audio_file(question.category, score);

    if (!audio_file_name) return;

    const new_src = new URL(`../assets/sounds/${audio_file_name}`, import.meta.url).href;

    if (audio_player.value.src.endsWith(audio_file_name)) {
        audio_player.value.pause();
        audio_player.value.currentTime = 0;
        audio_player.value.play().catch(e => console.error("Error al reproducir el sonido.", e));
        return;
    }

    audio_player.value.src = new_src;

    audio_player.value.oncanplay = () => {
        audio_player.value.pause();
        audio_player.value.currentTime = 0;
        audio_player.value.play().catch(e => console.error("Error al reproducir el sonido.", e));
        audio_player.value.oncanplay = null;
    };
};

const get_video_src = (trait) => {
    if (!trait) return '';

    const file_name = `${trait}.mp4`;

    try {
        return new URL(`../assets/videos/${file_name}`, import.meta.url).href;
    } catch (e) {
        console.error("Error al generar la URL del vídeo.", e);
        return '';
    }
}

const video_src = computed(() => {
    return get_video_src(current_dominant_trait.value);
});

const handle_slider_change = (score, id) => {
    play_sound(score, id);

    set_dominant_trait();
};

const initialize_questions = () => {
    const saved_scores = localStorage.getItem(TEST_STORAGE_KEY);

    let shuffled_questions = shuffle_array(JSON.parse(JSON.stringify(questions_data)));

    const saved_status = localStorage.getItem(STATUS_STORAGE_KEY);
    const status_data = saved_status ? safe_parse(saved_status) : null;

    test_completed.value = status_data ? status_data.completed === true : false;

    const saved_trait = localStorage.getItem(DOMINANT_TRAIT_KEY);
    if (test_completed.value && saved_trait) {
        current_dominant_trait.value = saved_trait;
    } else {
        current_dominant_trait.value = 'default';
        if (saved_trait) {
            localStorage.removeItem(DOMINANT_TRAIT_KEY);
        }
    }

    if (saved_scores) {
        const scores_map = safe_parse(saved_scores);
        if (scores_map) {
            const saved_order_ids = safe_parse(localStorage.getItem(ORDER_STORAGE_KEY));

            let questions_to_load;

            if (saved_order_ids && saved_order_ids.length === questions_data.length) {
                const questions_map = questions_data.reduce((map, q) => {
                    map[q.id] = q;
                    return map;
                }, {});

                questions_to_load = saved_order_ids.map(id => {
                    const q = JSON.parse(JSON.stringify(questions_map[id]));

                    const saved_score = scores_map[id];
                    q.score = (saved_score !== undefined && saved_score >= 1 && saved_score <= 4)
                        ? saved_score
                        : q.score;

                    return q;
                });
            } else {
                questions_to_load = shuffled_questions.map(q => {
                    const saved_score = scores_map[q.id];
                    q.score = (saved_score !== undefined && saved_score >= 1 && saved_score <= 4)
                        ? saved_score
                        : q.score;
                    return q;
                });
            }

            questions.value = questions_to_load;

            return;
        }
    }

    questions.value = shuffled_questions;

    if (questions.value.length > 0) {
        const initial_order = questions.value.map(q => q.id);
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(initial_order));
    }

    if (!test_completed.value) {
        current_dominant_trait.value = 'default';
    }
};

const set_dominant_trait = () => {
    const categories = {};

    questions.value.forEach(q => {
        const category = q.category;
        const score_value = q.score;

        if (categories[category] === undefined) {
            categories[category] = 0;
        }
        categories[category] += score_value;
    });

    let max_score = -1;
    let tied_traits = [];

    for (const category in categories) {
        if (categories[category] > max_score) {
            max_score = categories[category];
            tied_traits = [category];
        } else if (categories[category] === max_score) {
            tied_traits.push(category);
        }
    }

    let dominant_trait;

    if (tied_traits.length === 1) {
        dominant_trait = tied_traits[0];
    } else if (tied_traits.length > 0) {
        const random_index = Math.floor(Math.random() * tied_traits.length);
        dominant_trait = tied_traits[random_index];
    } else {
        dominant_trait = 'default';
    }

    current_dominant_trait.value = dominant_trait;

    return dominant_trait;
};

const save_test_status = (is_completed) => {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify({ completed: is_completed }));
    test_completed.value = is_completed;
};

const reset_test_scores = () => {
    localStorage.removeItem(TEST_STORAGE_KEY);
    localStorage.removeItem(STATUS_STORAGE_KEY);
    localStorage.removeItem(DOMINANT_TRAIT_KEY);
    localStorage.removeItem(ORDER_STORAGE_KEY);

    current_dominant_trait.value = 'default';

    initialize_questions();

    show_results.value = false;
    test_completed.value = false;

    reset_scroll();
};

const results = computed(() => {
    const categories = {};
    questions.value.forEach(q => {
        const category = q.category;
        const score_value = q.score;

        if (categories[category] === undefined) {
            categories[category] = 0;
        }
        categories[category] += score_value;
    });

    return categories;
});

const category_order_keys = [
    "neuroticismo",
    "extraversion",
    "apertura_experiencia",
    "amabilidad",
    "conciencia"
];

const category_display_names = {
    "neuroticismo": "Neuroticismo",
    "extraversion": "Extraversión",
    "apertura_experiencia": "Apertura a la experiencia",
    "amabilidad": "Amabilidad",
    "conciencia": "Conciencia"
};

const ordered_results = computed(() => {
    const scores = results.value;

    return category_order_keys.map(category_key => {
        const score = scores[category_key] !== undefined ? scores[category_key] : 0;

        let intensity;

        if (score >= 16) {
            intensity = 3;
        } else if (score >= 11) {
            intensity = 2;
        } else if (score >= 6) {
            intensity = 1;
        } else {
            intensity = 1;
        }

        return {
            category_key: category_key,
            category_name: category_display_names[category_key],
            score,
            intensity: intensity
        };
    });
});

const trait_class = computed(() => {
    return `theme_${current_dominant_trait.value || 'default'}`;
});

const complete_test = () => {
    const dominant_trait = set_dominant_trait();

    const scores_map = questions.value.reduce((acc, q) => {
        acc[q.id] = q.score;
        return acc;
    }, {});
    localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(scores_map));
    localStorage.setItem(DOMINANT_TRAIT_KEY, dominant_trait);

    save_test_status(true);

    show_results.value = true;
    reset_scroll();

    if (video_player.value) {
        video_player.value.load();
        video_player.value.muted = is_video_muted.value;
        video_player.value.play().catch(e => console.warn("La reproducción automática del vídeo ha sido bloqueada.", e));
    }
};

const back_to_test = () => {
    show_results.value = false;
    reset_scroll();

    if (video_player.value) {
        video_player.value.pause();
    }
}

const toggle_mute_video = () => {
    if (video_player.value) {
        const new_muted_state = !video_player.value.muted;
        video_player.value.muted = new_muted_state;
        is_video_muted.value = new_muted_state;
    }
};

const play_video = () => {
    if (video_player.value) {
        video_player.value.play().catch(e => console.error("Error al reproducir el vídeo.", e));
    }
};

const pause_video = () => {
    if (video_player.value) {
        video_player.value.pause();
    }
};

const is_video_playing = ref(false);

const handle_video_status = () => {
    if (video_player.value) {
        is_video_playing.value = !video_player.value.paused;
        is_video_muted.value = video_player.value.muted;
    }
};

watch(video_player, (new_player) => {
    if (new_player) {
        new_player.removeEventListener('play', handle_video_status);
        new_player.removeEventListener('pause', handle_video_status);
        new_player.removeEventListener('ended', handle_video_status);
        new_player.removeEventListener('volumechange', handle_video_status);

        new_player.addEventListener('play', handle_video_status);
        new_player.addEventListener('pause', handle_video_status);
        new_player.addEventListener('ended', handle_video_status);
        new_player.addEventListener('volumechange', handle_video_status);

        handle_video_status();
    }
});

watch(current_dominant_trait, (new_trait) => {
    theme_dominant_trait(new_trait || 'default');
}, { immediate: true });

onMounted(() => {
    initialize_questions();

    if (test_completed.value) {
        show_results.value = true;
    }
});

onUnmounted(() => {
    if (!test_completed.value) {
        theme_dominant_trait('default');
    }

    if (video_player.value) {
        video_player.value.removeEventListener('play', handle_video_status);
        video_player.value.removeEventListener('pause', handle_video_status);
        video_player.value.removeEventListener('ended', handle_video_status);
        video_player.value.removeEventListener('volumechange', handle_video_status);
    }
});
</script>

<template>
    <div class="content" :class="[trait_class, { 'test_completed': test_completed }]">

        <audio ref="audio_player"></audio>

        <div v-if="!show_results" class="test_edit">
            <div v-if="!test_completed" class="test_edit_about">
                <h1 class="test_edit_title">vamos a calcular tu frecuencia</h1>
                <p class="test_edit_directions">
                    A continuación se presentan una serie de afirmaciones.
                    <br>
                    Sitúa el deslizador según estés totalmente en desacuerdo (1) o totalmente de acuerdo (4) con ellas.
                    <br>
                    Para afinar tu personalidad correctamente es esencial que respondas de forma honesta.
                </p>
            </div>
            <div v-for="q in questions" :key="q.id" class="question_item">
                <p>{{ q.text }}</p>
                <div class="slider">
                    <input type="range" min="1" max="4" step="1" v-model.number="q.score" class="slider_input"
                        @change="handle_slider_change(q.score, q.id)" />
                    <div class="slider_info">
                        <span>1</span> <span>2</span> <span>3</span> <span>4</span>
                    </div>
                </div>
            </div>
            <button @click="complete_test" class="test_button_complete"> ver resultados </button>
        </div>

        <div v-else class="test_results">
            <div class="test_results_about">
                <h1 class="test_results_title">así suena tu personalidad</h1>
            </div>

            <video :src="video_src" ref="video_player" autoplay loop class="results_video"></video>

            <div class="video_controls">
                <button v-if="!is_video_playing" @click="play_video" class="video_controls_button">
                    <span class="material-symbols-rounded">play_arrow</span>
                </button>
                <button v-else @click="pause_video" class="video_controls_button">
                    <span class="material-symbols-rounded">pause</span>
                </button>
                <button @click="toggle_mute_video" class="video_controls_button">
                    <span v-if="is_video_muted" class="material-symbols-rounded">music_off</span>
                    <span v-else class="material-symbols-rounded">music_note</span>
                </button>
            </div>

            <ul class="results_list">
                <h2 class="results_list_title">Esta es la intensidad de tus rasgos</h2>

                <li v-for="({ category_key, category_name, intensity }) in ordered_results" :key="category_key"
                    :class="[category_key, `intensity_${intensity}`]">
                    <h3> {{ category_name }} </h3>
                    <div class="results_bar"></div>
                </li>
            </ul>
            <div class="results_buttons">
                <button @click="back_to_test" class="test_button_edit"> ver respuestas </button>
                <button @click="reset_test_scores" class="test_button_reset"> rehacer el test </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8rem 4rem 4rem 4rem;
    gap: 2rem;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    color: $color_dark;
    background-color: $color_light;
    user-select: none;
    z-index: 0;

    .test_edit {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 50%;

        .test_edit_about {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            text-align: center;
        }

        .question_item {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            border: 3px solid $color_medium;
            background-color: $color_light;
            padding: 2rem;
            border-radius: 1rem;

            .slider {
                display: flex;
                flex-direction: column;
                gap: 1rem;

                .slider_input {
                    width: 100%;
                    -webkit-appearance: none;
                    appearance: none;
                    height: .5rem;
                    background-color: $color_medium;
                    border-radius: .5rem;
                    outline: none;
                    cursor: pointer;

                    &::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 2.5rem;
                        height: 1.25rem;
                        border-radius: 1.25rem;
                        border: none;
                        background-color: $color_dark;
                        cursor: pointer;
                    }

                    &::-moz-range-thumb {
                        width: 2.5rem;
                        height: 1.5rem;
                        border-radius: 1.25rem;
                        border: none;
                        background-color: $color_dark;
                        cursor: pointer;
                    }
                }

                .slider_info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    span {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 2.5rem;
                    }
                }
            }
        }

        .test_button_complete {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 3rem;
            border-radius: 1.5rem;
            color: var(--color_light);
            background-color: var(--color_dark);
            font-family: 'Nunito';
            font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
            font-weight: 600;
            cursor: pointer;

            @media (hover: hover) {

                &:hover,
                &:active {
                    background-color: var(--color_medium);
                }
            }
        }
    }

    .test_results {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        width: 50%;

        .test_results_about {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            z-index: 1;
            text-align: center;
        }

        .results_video {
            width: 100%;
            min-width: 480px;
            max-width: 960px;
            margin: -8rem 0;
        }

        .results_list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            width: 100%;
            margin-top: 2rem;

            li {
                display: flex;
                flex-direction: column;
                gap: .75rem;
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                font-weight: 450;

                .results_bar {
                    display: flex;
                    align-items: center;
                    height: 1rem;
                    border-radius: .5rem;
                    color: var(--color_light);
                    background-color: var(--color_medium);
                }

                &.intensity_1 {
                    .results_bar {
                        width: calc(100% / 3);
                    }
                }

                &.intensity_2 {
                    .results_bar {
                        width: calc((100% / 3) * 2);
                    }
                }

                &.intensity_3 {
                    .results_bar {
                        width: 100%;
                    }
                }
            }
        }

        .video_controls {
            display: flex;
            align-items: center;
            gap: .75rem;
            z-index: 1;

            .video_controls_button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3rem;
                height: 3rem;
                border-radius: 1.5rem;
                cursor: pointer;
                border: 3px solid var(--color_medium);
                background-color: var(--color_light);
                color: var(--color_medium);

                .material-symbols-rounded {
                    font-size: 2rem;
                    font-weight: 450;
                }

                @media (hover: hover) {

                    &:hover,
                    &:active {
                        background-color: var(--color_medium);
                        color: var(--color_light);
                    }
                }
            }
        }

        .results_buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            margin-top: 2rem;
            width: 100%;

            .test_button_edit {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 3rem;
                border-radius: 1.5rem;
                color: var(--color_dark);
                border: 3px solid var(--color_dark);
                font-family: 'Nunito';
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                font-weight: 600;
                cursor: pointer;

                @media (hover: hover) {

                    &:hover,
                    &:active {
                        color: var(--color_medium);
                        border: 3px solid var(--color_medium);
                    }
                }
            }

            .test_button_reset {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 3rem;
                border-radius: 1.5rem;
                color: var(--color_light);
                background-color: var(--color_dark);
                font-family: 'Nunito';
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                font-weight: 600;
                cursor: pointer;

                @media (hover: hover) {

                    &:hover,
                    &:active {
                        background-color: var(--color_medium);
                    }
                }
            }
        }
    }

    &.test_completed {
        color: var(--color_dark);
        background-color: var(--color_light);

        .test_edit {

            .question_item {
                border: 3px solid var(--color_medium);
                background-color: var(--color_light);
                pointer-events: none;

                .slider {
                    .slider_input {
                        background-color: var(--color_medium);

                        &::-webkit-slider-thumb {
                            background-color: var(--color_dark);
                        }

                        &::-moz-range-thumb {
                            background-color: var(--color_dark);
                        }
                    }
                }
            }

            .test_button_complete {
                color: var(--color_light);
                background-color: var(--color_dark);

                @media (hover: hover) {

                    &:hover,
                    &:active {
                        background-color: var(--color_medium);
                    }
                }
            }
        }
    }
}

@media (max-width: 1024px) {
    .content {
        padding: 6rem 4rem 4rem 4rem;

        .test_edit,
        .test_results {
            width: 70%;
        }
    }
}

@media (max-width: 768px) {
    .content {
        padding: 4rem;

        .test_edit,
        .test_results {
            width: 90%;
        }
    }
}
</style>