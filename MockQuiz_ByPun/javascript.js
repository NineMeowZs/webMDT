window.onload = function(){
    var myBtn = document.getElementById("myButton");
  myBtn.onclick = addItem;
}
  function addItem() {
    var newItem = document.createElement("li");
    newItem.innerHTML = "A new list item";
    
    // ??? How do I add this new item to the list?
    var list = document.getElementById("myList");

    list.appendChild(newItem);
    // ???
  }