import TextTweenElement from "../components/text-tween-element.js";

export default function(state, emitter) {
  state.showModal = true;

  function renderHydra() {
    src(o0).modulate(gradient().pixelate(2,2).brightness(-.5), -0.1)
    .layer(s0).out();
  }

  emitter.on("DOMContentLoaded", () => {
    renderHydra();

    document.onpaste = function (event) {
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;
      console.log(JSON.stringify(items)); // might give you mime types
      for (var index in items) {
          var item = items[index];
          if (item.kind === 'file') {
              var blob = item.getAsFile();
              var reader = new FileReader();
              reader.onload = function (event) {
                  console.log(event.target.result); // data url!

                  let img = new Image();
                  img.src = event.target.result;
                  img.onload = function(e) {
                    console.log(e)
                    s0.init({ src: img });
                  };
              }; 
              reader.readAsDataURL(blob);
          }
      }
    };
  });
}