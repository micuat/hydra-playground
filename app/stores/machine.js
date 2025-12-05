import TextTweenElement from "../components/text-tween-element.js";

export default function(state, emitter) {
  state.showModal = true;

  function renderHydra() {
    let mod = () => -1 * state.hydraValues.modulate;
    let sc = () => state.hydraValues.scale;
    src(o0).modulate(gradient().pixelate(2,2).brightness(-.5), mod)
    .layer(src(s0).mask(shape(4,1,0)).scale(sc)).out();
  }

  emitter.on("DOMContentLoaded", () => {
    state.hydraValues = {
      scale: 0.5,
      modulate: 0.1
    }
    renderHydra();

    document.onpaste = function (event) {
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;
      // console.log(JSON.stringify(items)); // might give you mime types
      for (var index in items) {
          var item = items[index];
          if (item.kind === 'file') {
              var blob = item.getAsFile();
              var reader = new FileReader();
              reader.onload = function (event) {
                  // console.log(event.target.result); // data url!

                  let img = new Image();
                  img.src = event.target.result;
                  img.onload = function(e) {
                    // console.log(e)
                    s0.init({ src: img });
                  };
              }; 
              reader.readAsDataURL(blob);
          }
      }
    };
  });
}