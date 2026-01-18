import TextTweenElement from "../components/text-tween-element.js";
import HydraCanvas from "../components/hydra-canvas.js";

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
    rotate: {
      value: 0.5,
      default: 0.5,
      name: "Rotate",
      func: function() { return (state.hydraValues.rotate.value - 0.5) * 1 }
    },
    modulateOsc: {
      value: 0,
      default: 0,
      name: "Mod OSC",
      func: function() { return state.hydraValues.modulateOsc.value * 0.2 }
    },
    modulateNoiseFreq: {
      value: 0,
      default: 0,
      name: "Noise Freq",
      func: function() { return state.hydraValues.modulateNoiseFreq.value * 10 }
    },
    modulateNoiseAmount: {
      value: 0,
      default: 0,
      name: "Noise Amt",
      func: function() { return state.hydraValues.modulateNoiseAmount.value * 0.05 }
    },
    modulateNoisePix: {
      value: 1,
      default: 1,
      name: "Noise Pix",
      func: function() { return Math.pow(2, 11*state.hydraValues.modulateNoisePix.value)}
    },
  }

  emitter.on("reset", () => {
    Object.keys(state.hydraValues).map(key => {
      state.hydraValues[key].value = state.hydraValues[key].default;
    })
    emitter.emit('render');
  });

  emitter.on("DOMContentLoaded", () => {
    state.cache(HydraCanvas, 'my-hydra').evalCode();

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