var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var addButton = document.getElementById("addButton");
var updateButton = document.getElementById("updateButton");
var currentIndex = "";

siteName.addEventListener("input", validateInputs);
siteUrl.addEventListener("input", validateInputs);

document.getElementById("searchInput").addEventListener("input", function () {
  var searchTerm = this.value;
  displayData(searchTerm);
});

var linksList = [];

if (localStorage.getItem("linksContainer") !== null) {
  linksList = JSON.parse(localStorage.getItem("linksContainer"));
  displayData();
}

function addLink() {
  if (!validateInputs()) {
    alert("اكتب البيانات بالشكل المطلوب");
    return;
  }

  var links = {
    name: siteName.value,
    url: siteUrl.value,
  };
  linksList.push(links);
  localStorage.setItem("linksContainer", JSON.stringify(linksList));
  displayData();
  clearForm();
  addButton.disabled = true;
}
function displayData(filter = "") {
  var box = "";

  for (let i = 0; i < linksList.length; i++) {
    if (linksList[i].name.toLowerCase().includes(filter.toLowerCase())) {
      box += `
        <tr>
          <td scope="row">${i + 1}</td>
          <td>${linksList[i].name}</td>
          <td>
            <a href="${linksList[i].url}" target="_blank">
              <button class="btn btn-outline-primary" type="button">
                <i class="fa-solid fa-eye fa-bounce px-2"></i>
              </button>
            </a>
          </td>
          <td>
            <button onclick="deleteLink(${i})" class="btn btn-outline-danger me-2">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button onclick="setUpdateInfo(${i})" class="btn btn-outline-warning ms-2">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </td>
        </tr>
      `;
    }
  }

  if (box === "") {
    box = `
      <tr>
        <td colspan="4" class="text-center text-danger fw-bold">No results</td>
      </tr>
    `;
  }

  document.getElementById("listdata").innerHTML = box;
}

function deleteLink(index) {
  linksList.splice(index, 1);
  localStorage.setItem("linksContainer", JSON.stringify(linksList));
  displayData();
}

function clearForm() {
  siteName.value = null;
  siteUrl.value = null;
}

function setUpdateInfo(index) {
  currentIndex = index;

  siteName.value = linksList[index].name;
  siteUrl.value = linksList[index].url;
  addButton.classList.add("d-none");
  updateButton.classList.remove("d-none");
  validateInputs();
}

function updateLink() {
  var links = {
    name: siteName.value,
    url: siteUrl.value,
  };
  linksList.splice(currentIndex, 1, links);
  localStorage.setItem("linksContainer", JSON.stringify(linksList));
  displayData();
  addButton.classList.remove("d-none");
  updateButton.classList.add("d-none");
  addButton.disabled = true;
  updateButton.disabled = true;
  clearForm();
}

function validateInputs() {
  var nameValid = siteName.value.trim().length >= 3;
  var urlValid = /^https?:\/\/.+$/.test(siteUrl.value.trim());

  var isValid = nameValid && urlValid;

  addButton.disabled = !isValid;
  updateButton.disabled = !isValid;

  return isValid;
}
