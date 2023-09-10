import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import yaml from 'highlight.js/lib/languages/yaml';
import hljsVuePlugin from '@highlightjs/vue-plugin';

hljs.registerLanguage('yaml', yaml);

const app = createApp(App)

app.use(hljsVuePlugin)

app.mount('#app')
