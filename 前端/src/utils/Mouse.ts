import { reactive, onMounted, onBeforeUnmount } from "vue";

function GetMousePos() {
    const page = reactive({
        x: 0,
        y: 0,
    });

    function GetPage(event: MouseEvent) {
        page.x = event.pageX;
        page.y = event.pageY;
    }

    onMounted(() => {
        document.addEventListener("mousemove", GetPage);
    });

    onBeforeUnmount(() => {
        document.removeEventListener("mousemove", GetPage);
    });

    return page;
}

export default GetMousePos;