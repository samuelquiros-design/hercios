<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { use_scroll_manager } from '~/composables/scroll_manager';

const { reset_scroll } = use_scroll_manager();

import video_neuroticismo from '@/assets/videos/neuroticismo.mp4';
import video_extraversion from '@/assets/videos/extraversion.mp4';
import video_apertura_experiencia from '@/assets/videos/apertura_experiencia.mp4';
import video_amabilidad from '@/assets/videos/amabilidad.mp4';
import video_conciencia from '@/assets/videos/conciencia.mp4';

const category_display_names = {
    "neuroticismo": "Neuroticismo",
    "extraversion": "Extraversión",
    "apertura_experiencia": "Apertura a la experiencia",
    "amabilidad": "Amabilidad",
    "conciencia": "Conciencia"
};

const videos = ref([
    {
        id: '01', title: 'Neuroticismo', category: 'neuroticismo', file: video_neuroticismo,
        intensities: { neuroticismo: 3, extraversion: 3, apertura_experiencia: 3, amabilidad: 2, conciencia: 1 }
    },
    {
        id: '02', title: 'Extraversión', category: 'extraversion', file: video_extraversion,
        intensities: { neuroticismo: 1, extraversion: 1, apertura_experiencia: 1, amabilidad: 1, conciencia: 1 }
    },
    {
        id: '03', title: 'Apertura a la Experiencia', category: 'apertura_experiencia', file: video_apertura_experiencia,
        intensities: { neuroticismo: 2, extraversion: 3, apertura_experiencia: 3, amabilidad: 1, conciencia: 1 }
    },
    {
        id: '04', title: 'Amabilidad', category: 'amabilidad', file: video_amabilidad,
        intensities: { neuroticismo: 2, extraversion: 1, apertura_experiencia: 1, amabilidad: 2, conciencia: 2 }
    },
    {
        id: '05', title: 'Conciencia', category: 'conciencia', file: video_conciencia,
        intensities: { neuroticismo: 1, extraversion: 1, apertura_experiencia: 1, amabilidad: 2, conciencia: 3 }
    }
]);

const current_index = ref(0);
const is_video_muted = ref(false);
const is_video_playing = ref(false);
const video_refs = ref({});

const sync_videos = async () => {
    await nextTick();
    const current_id = videos.value[current_index.value].id;

    Object.keys(video_refs.value).forEach(id => {
        const player = video_refs.value[id];
        if (!player) return;

        if (id === current_id) {
            player.play()
                .then(() => { is_video_playing.value = true })
                .catch(e => {
                    is_video_playing.value = false;
                    console.warn("Error al intentar reproducir.", e);
                })
        } else {
            player.pause();
            player.currentTime = 0;
        }
    })
}

function handle_video_pause(index) {
    if (current_index.value === index) {
        is_video_playing.value = false;
    }
}

const next = () => {
    current_index.value = (current_index.value + 1) % videos.value.length;
    sync_videos();
    reset_scroll();
}

const prev = () => {
    current_index.value = (current_index.value - 1 + videos.value.length) % videos.value.length;
    sync_videos();
    reset_scroll();
}

const toggle_play = () => {
    const player = video_refs.value[videos.value[current_index.value].id];
    if (player) {
        if (player.paused) {
            player.play().then(() => { is_video_playing.value = true });
        } else {
            player.pause();
            is_video_playing.value = false;
        }
    }
}

const toggle_mute = () => {
    is_video_muted.value = !is_video_muted.value;
    Object.values(video_refs.value).forEach(player => {
        if (player) player.muted = is_video_muted.value;
    })
}

onMounted(() => {
    setTimeout(() => {
        sync_videos();
    }, 500);
});

onUnmounted(() => {
    Object.values(video_refs.value).forEach(player => {
        if (player) {
            player.pause();
            player.src = "";
            player.load();
        }
    });
    video_refs.value = {};
    is_video_playing.value = false;
});
</script>

<template>
    <div :class="['content', `theme_${videos[current_index].category}`]">
        <div class="demo_samples">
            <div class="gallery_carousel">
                <div class="carousel_track" :style="{ transform: `translateX(-${current_index * 100}%)` }">
                    <div v-for="(video, index) in videos" :key="video.id"
                        :class="['video_card', `category_${video.category}`, { 'active': current_index === index }]">

                        <div class="video_container">
                            <video :ref="el => { if (el) video_refs[video.id] = el }" class="video_player" loop
                                :muted="is_video_muted" playsinline preload="auto" :src="video.file"
                                @playing="is_video_playing = true" @pause="handle_video_pause(index)">
                            </video>
                        </div>
                    </div>
                </div>
            </div>
            <div class="video_controls">
                <button class="nav_button prev" @click="prev">
                    <span class="material-symbols-rounded">chevron_left</span>
                </button>
                <button @click="toggle_play" class="video_controls_button">
                    <span v-if="is_video_playing" class="material-symbols-rounded">pause</span>
                    <span v-else class="material-symbols-rounded">play_arrow</span>
                </button>
                <button @click="toggle_mute" class="video_controls_button">
                    <span v-if="is_video_muted" class="material-symbols-rounded">music_off</span>
                    <span v-else class="material-symbols-rounded">music_note</span>
                </button>
                <button class="nav_button next" @click="next">
                    <span class="material-symbols-rounded">chevron_right</span>
                </button>
            </div>

            <ul class="video_data">
                <li v-for="(intensity, key) in videos[current_index].intensities" :key="key"
                    :class="[key, `intensity_${intensity}`]">
                    <h3> {{ category_display_names[key] }} </h3>
                    <div class="data_bar"></div>
                </li>
            </ul>
        </div>
    </div>


</template>


<style lang="scss" scoped>
@use "sass:map";

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8rem 4rem 4rem 4rem;
    gap: 2rem;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 0;

    @each $name, $colors in $palettes {
        &.theme_#{$name} {
            --color_light_auto: #{map.get($colors, light)};
            --color_medium_auto: #{map.get($colors, medium)};
            --color_dark_auto: #{map.get($colors, dark)};
        }
    }

    .demo_samples {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 1.5rem;

        .gallery_carousel {
            display: flex;
            width: 50%;
            gap: 1.5rem;

            .carousel_track {
                display: flex;
                transition: transform .3s ease-in-out;
                width: 100%;

                .video_card {
                    min-width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    opacity: 1;
                    transform: scale(1);
                    transition: all .3s ease-in-out;

                    &:not(.active) {
                        opacity: 0;
                        transform: scale(0);
                    }

                    .video_container {
                        width: 100%;
                        min-width: 240px;
                        max-width: 640px;
                        aspect-ratio: 1 / 1;
                        border-radius: 1rem;
                        border: 3px solid var(--color_medium_auto);
                        background-color: var(--color_light_auto);
                        overflow: hidden;

                        .video_player {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }
            }
        }

        .video_controls {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50%;
            gap: .75rem;
            z-index: 1;

            .video_controls_button,
            .nav_button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3rem;
                height: 3rem;
                border-radius: 1.5rem;
                cursor: pointer;
                border: 3px solid var(--color_medium_auto);
                background-color: var(--color_light_auto);
                color: var(--color_medium_auto);

                .material-symbols-rounded {
                    font-size: 2rem;
                    font-weight: 450;
                }

                @media (hover: hover) {
                    &:hover {
                        background-color: var(--color_medium_auto);
                        color: var(--color_light_auto);
                    }
                }
            }
        }

        .video_data {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            width: 50%;
            max-width: 960px;
            margin-top: 2rem;

            li {
                display: flex;
                flex-direction: column;
                gap: .75rem;
                color: var(--color_dark_auto);
                font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                font-weight: 450;

                .data_bar {
                    display: flex;
                    align-items: center;
                    height: 1rem;
                    border-radius: .5rem;
                    color: var(--color_light_auto);
                    background-color: var(--color_medium_auto);
                    transition: width 0.5s ease;
                }

                &.intensity_1 {
                    .data_bar {
                        width: calc(100% / 3);
                    }
                }

                &.intensity_2 {
                    .data_bar {
                        width: calc((100% / 3) * 2);
                    }
                }

                &.intensity_3 {
                    .data_bar {
                        width: 100%;
                    }
                }
            }
        }
    }
}

@media (max-width: 1024px) {
    .content {
        padding: 6rem 4rem 4rem 4rem;

        .demo_samples {

            .gallery_carousel,
            .video_controls,
            .video_data {
                width: 75%;

            }
        }
    }
}

@media (max-width: 768px) {
    .content {
        padding: 4rem;

        .demo_samples {

            .gallery_carousel,
            .video_controls,
            .video_data {
                width: 100%;

            }
        }
    }
}
</style>