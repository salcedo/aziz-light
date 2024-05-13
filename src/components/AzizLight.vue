<template>
  <v-container>
    <v-row align="center">
      <v-col v-for="device in Object.keys(devices)" :key="device" cols="auto">
        <aziz-bulb
          :device="devices[device]"
          :device-name="device"
          :settings="settings"
          @command="onCommand"
          :key="devicesJson"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["devices", "settings"]);
const emit = defineEmits(["command"]);

const devicesJson = computed(() => JSON.stringify(props.devices));

function onCommand(command) {
  emit("command", command);
}
</script>
