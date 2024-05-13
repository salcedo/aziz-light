<template>
  <v-card>
    <v-card-title>{{ settings.friendlyNames[deviceName] }}</v-card-title>
    <v-card-subtitle>{{ deviceName }}</v-card-subtitle>
    <v-card-actions>
      <v-btn
        :color="device.POWER == 'ON' ? 'primary' : 'darkgrey'"
        @click="togglePower(deviceName)"
        >{{ device.POWER }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps(["device", "deviceName", "settings"]);
const emit = defineEmits(["command"]);

function togglePower(deviceName) {
  emit("command", {
    device: deviceName,
    command: "Power",
    parameter: "toggle",
  });
}
</script>
