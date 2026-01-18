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
        // console.log(e)
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
        <button class="border-2 border-black" onclick=${ pasteImage }>paste</button>
        <div class="flex flex-col items-end">
          ${
            Object.keys(state.hydraValues).map(key =>
              html`
              <div>
                <label>${ state.hydraValues[key].name }</label>
                <input
                  type="range" class="" id="slider-${ key }" oninput="${ sliderInput }"
                  min="0" max="100" value="${ state.hydraValues[key].default * 100 }" step="1" />
              </div>`
            )
          }
        </div>
        <div>
          <button class="border-2 border-black" onclick=${ play }>▶️</button>
          <button class="border-2 border-black" onclick=${ pause }>⏸️</button>
          <button class="border-2 border-black" onclick=${ next }>⏭️</button>
          <button class="border-2 border-black" onclick=${ clear }>❌</button>
        </div>
        <a id="downloadLnk" class="border-2 border-black" download="hydra-playground.png" onclick="${ download }">Download</a>
        <a class="border-2 border-black" onclick="${ copy }">Copy</a>
        <a class="border-2 border-black" onclick="${ reset }">Reset</a>
      </div>
    </div>
  `;

  function sliderInput(e) {
    const key = e.target.id.split("-")[1];
    state.hydraValues[key].value = e.target.value * 0.01;
  }

  function download(e) {
    state.cache(HydraCanvas, 'my-hydra').download(e);
  }

  function copy() {
    state.cache(HydraCanvas, 'my-hydra').copy();
  }

  function reset() {
    emit('reset');
  }

  function play(e) {
    state.cache(HydraCanvas, 'my-hydra').play();
  }

  function pause(e) {
    state.cache(HydraCanvas, 'my-hydra').pause();
  }

  function next(e) {
    state.cache(HydraCanvas, 'my-hydra').nextFrame();
  }

  function clear(e) {
    state.cache(HydraCanvas, 'my-hydra').clear();
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
