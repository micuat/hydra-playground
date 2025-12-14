import TextTweenElement from "../components/text-tween-element.js";

export default function(state, emitter) {
  state.showModal = true;
  state.hydraValues = {
    scale: {
      value: 0.5,
      default: 0.5,
      name: "Scale",
      func: function() { return state.hydraValues.scale.value }
    },
    modulate: {
      value: 0.5,
      default: 0.5,
      name: "Modulate",
      func: function() { return state.hydraValues.modulate.value * -1 }
    },
    modulateOsc: {
      value: 0,
      default: 0,
      name: "Mod OSC",
      func: function() { return state.hydraValues.modulateOsc.value * 0.2 }
    },
  }

  function renderHydra() {
    src(o0).modulate(gradient().pixelate(2,2).brightness(-.5), state.hydraValues.modulate.func)
    .modulate(osc(6,0).brightness(-.5),state.hydraValues.modulateOsc.func)
    .layer(src(s0).mask(shape(4,1,0)).scale(state.hydraValues.scale.func)).out();
  }

  emitter.on("DOMContentLoaded", () => {
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