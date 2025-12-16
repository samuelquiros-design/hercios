import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const reset_scroll_visible_threshold = 0;
const reset_scroll_visible = ref(false);
let scrollable_elements = [];
let mutation_observer = null;

function get_scrollable_elements() {
    const all = Array.from(document.querySelectorAll('*'));
    return all.filter(el => {
        const cs = window.getComputedStyle(el);
        const overflow_y = cs.overflowY;
        const can_overflow =
            overflow_y === 'auto' ||
            overflow_y === 'scroll' ||
            overflow_y === 'overlay';
        return can_overflow && el.scrollHeight > el.clientHeight;
    });
}

function on_any_scroll() {
    if ((window.scrollY || window.pageYOffset) > reset_scroll_visible_threshold) {
        reset_scroll_visible.value = true;
        return;
    }

    for (const el of scrollable_elements) {
        if (el.scrollTop > reset_scroll_visible_threshold) {
            reset_scroll_visible.value = true;
            return;
        }
    }

    reset_scroll_visible.value = false;
}

function bind_scroll_listeners() {
    unbind_scroll_listeners();
    scrollable_elements = get_scrollable_elements();
    window.addEventListener('scroll', on_any_scroll, { passive: true });
    for (const el of scrollable_elements) {
        el.addEventListener('scroll', on_any_scroll, { passive: true });
    }
    on_any_scroll();
}

function unbind_scroll_listeners() {
    try {
        window.removeEventListener('scroll', on_any_scroll);
    } catch (e) { }
    if (scrollable_elements?.length) {
        for (const el of scrollable_elements) {
            try {
                el.removeEventListener('scroll', on_any_scroll);
            } catch (e) { }
        }
    }
    scrollable_elements = [];
}

async function reset_scroll() {
    await nextTick();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const targets = scrollable_elements.length
        ? scrollable_elements
        : get_scrollable_elements();

    targets.forEach(el => {
        if (typeof el.scrollTo === 'function') {
            el.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            el.scrollTop = 0;
        }
    });

    on_any_scroll();
}

function setup_mutation_observer() {
    if (typeof MutationObserver === 'undefined') return;
    mutation_observer = new MutationObserver(() => {
        bind_scroll_listeners();
    });
    mutation_observer.observe(document.documentElement || document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
}


export function use_scroll_manager() {
    onMounted(() => {
        bind_scroll_listeners();
        window.addEventListener('resize', bind_scroll_listeners);
        window.addEventListener('orientationchange', bind_scroll_listeners);
        setup_mutation_observer();
    });

    onUnmounted(() => {
        unbind_scroll_listeners();
        window.removeEventListener('resize', bind_scroll_listeners);
        window.removeEventListener('orientationchange', bind_scroll_listeners);
        mutation_observer?.disconnect();
        mutation_observer = null;
    });

    return {
        reset_scroll_visible,
        reset_scroll,
    };
}