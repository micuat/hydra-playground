// import choo's template helper
import html from "choo/html";

import HydraCanvas from "../components/hydra-canvas.js";

async function pasteImage(e) {
  try {
    const clipboardContents = await navigator.clipboard.read();
    for (const item of clipboardContents) {
      if (!item.types.includes("image/png") && !item.types.includes("image/jpg")) {
        throw new Error("Clipboard does not contain PNG image data.");
      }
      const type = item.types.includes("image/png") ? "image/png" : "image/jpg";
      const blob = await item.getType(type);
      let img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = function(e) {
        console.log(e)
        s0.init({ src: img });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

// export module
export default function(state, emit) {
  
  return html`
    <div class="absolute left-0 top-0 w-screen h-screen">
      <div class="absolute left-0 top-0 z-[-2] w-screen h-screen">
        ${ state.cache(HydraCanvas, 'my-hydra').render(state, emit) }
      </div>
      <button class="absolute left-2 top-2 text-xl" onclick=${ question }>ℹ️</button>
      <div class="absolute left-0 top-0 z-10 border-2 border-black bg-white m-2 p-2 ${ state.showModal ? "" : "hidden" }">
        <button class="text-xl" onclick=${ hideModal }>❎</button>
        <div class="font-bold">ctrl+v or press below to paste image</div>
        <input class="border-2 border-black" type="text">
        <button class="border-2 border-black block" onclick=${ pasteImage }>paste</button>
        <label>scale</label>
        <input
          type="range" class="block" id="slider-scale" oninput="${ sliderInput }"
          min="0" max="100" value="50" step="1" />
        <label>modulate</label>
        <input
          type="range" class="block" id="slider-modulate" oninput="${ sliderInput }"
          min="0" max="100" value="50" step="1" />
      </div>
    </div>
  `;

  function sliderInput(e) {
    console.log(e.target)
    switch (e.target.id) {
      case "slider-scale":
        state.hydraValues.scale = e.target.value * 0.01;
        break;
      case "slider-modulate":
        state.hydraValues.modulate = e.target.value * 0.01;
        break;
    }
  }

  function question(e) {
    e.preventDefault();
    state.showModal = !state.showModal;
    emit("render");
  }
  function hideModal(e) {
    if (state.showModal) {
      state.showModal = false;
      emit("render");
    }
  }
};
