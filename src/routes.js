import App from './App.vue'
import Chieru from './Chieru.vue'

const About = { template: '<p>about page</p>' }

export default {
    '/': App,
    '/About': About,
    '/Chieru': Chieru
}
