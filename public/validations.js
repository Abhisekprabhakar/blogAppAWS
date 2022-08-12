function validation() {
  var valid = 0;

  if (document.getElementById("title").value.length < 3) {
    document.getElementById("title-error").innerHTML =
      "Please Enter title of atleast 3 letters!";
    return false;
  } else if (document.getElementById("title").value.length > 50) {
    document.getElementById("title-error").innerHTML =
      "Please Enter title in less than 50 letters!";
    return false;
  } else {
    document.getElementById("title-error").innerHTML = "";
    valid = 1;
  }

  if (document.getElementById("category").value.length < 3) {
    document.getElementById("category-error").innerHTML =
      "Please Enter category of atleast 3 letters!";
    return false;
  } else if (document.getElementById("category").value.length > 15) {
    document.getElementById("category-error").innerHTML =
      "Please Enter category in less than 15 letters!";
    return false;
  } else {
    document.getElementById("category-error").innerHTML = "";
    valid = 1;
  }
  if (document.getElementById("content").value.length >= 255) {
    document.getElementById("content-error").innerHTML =
      "Please Enter atmost 255 letters of content!";
    return false;
  } else {
    document.getElementById("content-error").innerHTML = "";
    valid = 1;
  }

  if (valid == 1) {
    return true;
  } else {
    return false;
  }
}
