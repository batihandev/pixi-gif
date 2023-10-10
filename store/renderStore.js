import { ref } from "vue";

export const renderStarted = ref(false);

export function setRenderStarted(value) {
  renderStarted.value = value;
}
