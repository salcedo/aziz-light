/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { createPahoMqttPlugin } from "vue-paho-mqtt";

const app = createApp(App).use(
  createPahoMqttPlugin({
    PluginOptions: {
      autoConnect: false,
      showNotifications: false,
    },
    /*
    MqttOptions: {
      host: "localhost",
      port: 9001,
      clientId: `MyID-${Math.random() * 9999}`,
      mainTopic: "MAIN",
    },
    */
  })
);
registerPlugins(app);

app.mount("#app");
