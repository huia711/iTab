<template>
    <div class="basis">
        <div class="texts">
            <p>{{ t('settingPage.about.author') }}</p>
            <p>{{ t('settingPage.about.rights') }}</p>
        </div>
    </div>
</template>

<script>
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { computed } from '@vue/reactivity';

export default{
    setup(){
        const store = useStore();
        const {t} = useI18n();
        return{
            fontColor: computed(()=>store.state.settings.pageColorStyle.fontColor),
            t
        }
    }
}
</script>

<style scoped>
.basis{
    max-height: 600px;
    min-height: 600px;
    width: 600px;
    display: flex;
    margin: 0;
    padding: 10px 30px 10px 30px;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    font-family: serif;
}

.texts{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: v-bind("fontColor");
}
</style>