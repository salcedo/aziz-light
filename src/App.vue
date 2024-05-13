<template>
  <v-app>
    <v-layout>
      <v-app-bar title="Aziz! Light!">
        <template #append>
          <v-btn icon="mdi-cog" @click="settingsDialog = !settingsDialog" />
          <v-dialog v-model="settingsDialog">
            <aziz-settings
              :devices="devices"
              :settings="settings"
              @close="settingsDialog = false"
              @update-settings="updateSettings"
            />
          </v-dialog>
        </template>
      </v-app-bar>
      <v-main>
        <aziz-light
          :devices="devices"
          :settings="settings"
          @command="onCommand"
        />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { $mqtt } from "vue-paho-mqtt";
import { cloneDeep } from "lodash";

const settings = ref({
  mqtt: {
    host: "127.0.0.1",
    port: 9001,
    username: "",
    password: "",
    mainTopic: "cmnd",
  },
  friendlyNames: {},
  groups: {},
});
const settingsDialog = ref(false);
const devices = ref({});

function loadSettings() {
  const s = window.localStorage.getItem("aziz-settings");
  if (s) {
    settings.value = JSON.parse(s);
  }
}
function saveSettings() {
  window.localStorage.setItem("aziz-settings", JSON.stringify(settings.value));
}
function applySettings() {
  Object.keys(settings.value.mqtt).forEach((key) => {
    const setting = settings.value.mqtt[key];
    $mqtt[key](key == "port" ? parseInt(setting) : setting);
  });
}
function updateSettings(value) {
  settings.value = cloneDeep(value);
  saveSettings();
  applySettings();
  connectToMQTT();
}
function onMessageArrived({ payloadString, topic }) {
  if (!topic.startsWith("stat/")) return;

  const topicParts = topic.split("/");
  if (topicParts.length != 3) return;

  const device = topicParts[1];
  const command = topicParts[2];

  switch (command) {
    case "RESULT":
      const result = JSON.parse(payloadString);
      addDevice(device);
      devices.value[device] = { ...devices.value[device], ...result };
      break;
    case "STATUS":
      addDevice(device);
      break;
    default:
      console.log(
        `Unhandled command '${command}' from device '${device}': ${payloadString}`
      );
      break;
  }
}
function onCommand({ device, command, parameter }) {
  publish(`${device}/${command}`, parameter);
}
function addDevice(device) {
  if (!devices.value.hasOwnProperty(device)) {
    devices.value[device] = {};
    if (!settings.value.friendlyNames.hasOwnProperty(device)) {
      settings.value.friendlyNames[device] = "";
      saveSettings();
    }
    ["Color", "CT", "Power", "White"].forEach((command) => {
      publish(`${device}/${command}`);
    });
  }
}
function publish(topic, payload) {
  $mqtt.publish(topic, payload ? payload : "", "Fnr");
}
function connectToMQTT() {
  console.log("connecting");
  $mqtt.connect({
    onConnect: () => {
      $mqtt.subscribe("stat/#", () => {}, false);
      publish("tasmotas/Status");
    },
    onMessageArrived,
  });
}
onBeforeMount(() => {
  loadSettings();
  applySettings();
  connectToMQTT();
});
</script>
