window.onload = setup;
function setup() {
  console.log("drag ex");
  let handleDragging = function (event) {
    console.log("on drag")
    //HERE :: the event target refers to the object being dragged...
    console.log(event.target.id);
  };
 window.addEventListener("dragstart", handleDragging);
 
}