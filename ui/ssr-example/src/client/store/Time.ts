import dayjs from "dayjs";
import { createStoreWithComponent, onMounted, onUnmounted, ref } from "reactivity-store";

export const Time = createStoreWithComponent({
  setup: () => {
    const time = ref<string>(dayjs().format("YYYY-MM-DD  HH:mm:ss"));

    const isMount = ref(false);

    let id = null;

    onMounted(() => {
      id = setInterval(() => {
        time.value = dayjs().format("YYYY-MM-DD  HH:mm:ss");
      }, 1000);
    });

    onMounted(() => {
      isMount.value = true;
    });

    onUnmounted(() => {
      clearInterval(id);
    });

    return { time, isMount };
  },
});
