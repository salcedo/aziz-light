<template>
  <v-card title="Aziz! Settings!" scrollable>
    <v-container>
      <v-row>
        <v-col>MQTT:</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" xs="12">
          <v-text-field
            v-model="$settings.mqtt.host"
            clearable
            label="Host"
            prepend-icon="mdi-server"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" xs="12">
          <v-text-field
            v-model="$settings.mqtt.port"
            clearable
            label="Port"
            prepend-icon="mdi-ethernet"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" xs="12">
          <v-text-field
            v-model="$settings.mqtt.username"
            clearable
            label="Username"
            prepend-icon="mdi-account"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" xs="12">
          <v-text-field
            v-model="$settings.mqtt.password"
            clearable
            type="password"
            label="Password"
            prepend-icon="mdi-security"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" xs="12">
          <v-text-field
            v-model="$settings.mqtt.mainTopic"
            clearable
            label="Main Topic"
            prepend-icon="mdi-comment"
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-divider class="mb-4" />
      <v-row>
        <v-col>Friendly Names:</v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="name in Object.keys($settings.friendlyNames)"
          :key="name"
          cols="12"
          md="6"
          xs="12"
        >
          <v-text-field
            v-model="$settings.friendlyNames[name]"
            clearable
            :label="name"
            prepend-icon="mdi-rename-box"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="emit('close')">
        <template #prepend>
          <v-icon icon="mdi-close" />
        </template>
        Close
      </v-btn>
      <v-btn
        :color="settingsChanged ? 'primary' : 'grey'"
        :disabled="!settingsChanged"
        @click="
          updateSettings();
          emit('close');
        "
      >
        <template #prepend>
          <v-icon icon="mdi-content-save" />
        </template>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { cloneDeep } from "lodash";

const props = defineProps(["devices", "settings"]);
const emit = defineEmits(["close", "update-settings"]);

const settingsChanged = computed(
  () => JSON.stringify(props.settings) != JSON.stringify($settings.value)
);
const $settings = ref(cloneDeep(props.settings));

function updateSettings() {
  console.log($settings.value);
  emit("update-settings", $settings.value);
}
</script>
