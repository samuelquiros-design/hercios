<script setup>

</script>

<template>
    <div class="content">
        <section class="about">
            <div class="about_content" ref="about_content_ref">
                <h1 class="about_content_title">descubre tu identidad sonora a través de los hercios</h1>
                <h2 class="about_content_text">
                    ¿Y si la identidad no dependiera de lo que vemos, sino de quiénes somos realmente?
                </h2>
                <h3 class="about_content_text">
                    Hercios plantea un sistema capaz de traducir los rasgos del carácter en notas musicales que se
                    combinan y dan lugar a un acorde personal. A esta melodía también se le asigna un instrumento que
                    refleja la personalidad de cada individuo.
                </h3>
            </div>

            <div class="about_cta">
                <button class="about_cta_demo">
                    <NuxtLink to="/test">
                        <span class="button_tag">realiza el test</span>
                        <span class="material-symbols-rounded">tune</span>
                    </NuxtLink>
                </button>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 8rem 4rem 4rem 4rem;
    overflow-y: auto;
    font-size: 2rem;
    user-select: none;
    z-index: 0;

    .about {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4rem;
        width: 70%;
        margin-top: auto;
        margin-bottom: auto;

        .about_content {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            text-align: center;
        }

        .about_cta {
            .about_cta_demo {
                display: flex;
                justify-content: end;

                a {
                    display: flex;
                    align-items: center;

                    .button_tag {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 3rem;
                        padding: 0 3.5rem 0 1rem;
                        margin-right: -3rem;
                        border-radius: 1.5rem;
                        font-family: 'Nunito';
                        font-size: clamp(1.25rem, 2.5dvw, 1.5rem);
                        font-weight: 600;
                        background: none;
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
                        background: none;
                        border: 3px solid var(--color_dark);
                        transition: background-color 0s, border 0s;
                    }
                }

                @media (hover: hover) {

                    &:hover,
                    &:active {

                        .button_tag,
                        .material-symbols-rounded {
                            background-color: var(--color_dark);
                            color: var(--color_light);
                            transition: background-color 0s, color 0s;

                        }
                    }
                }
            }
        }
    }
}

@media (max-width: 1024px) {
    .content {
        padding: 6rem 4rem 4rem 4rem;

        .about {
            width: 85%;
        }
    }
}

@media (max-width: 768px) {
    .content {
        padding: 4rem;

        .about {
            width: 100%;
        }
    }
}
</style>