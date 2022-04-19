var host = "https://localhost:3000";
var limit = 5;
var pagination = document.getElementById("pagination");
var bodyTable = document.getElementById("body-list-user");
var lastName = document.getElementById("lastName");
var firstName = document.getElementById("firstName");
var email = document.getElementById("email");
var workLocation = document.getElementById("workLocation");
var hobbies = document.getElementById("hobbies");
var userId;
var formModal = document.getElementById("formModal");
var fetchUserEvent = (page) => {
  fetch(
    `${host}/user/list-user?eventId=${eventId}&limit=${limit}&page=${page}`,
    {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        setPagination(data);
        addListHtmlCb(data);
      }
    })
    .catch((error) => {});
};
var fetchUpDateUser = async (data) => {
  var token = localStorage.getItem("token");
  var response = await fetch(`${host}/account/update-user-registed-event`, {
    method: "PUT", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(data),
  });
  var data = await response.json();
  if (data) {
    if (data.status) {
      alert("Update success");
      window.location.reload();
      return;
    }
    alert("Update Fail: " + data.error.message);
  } else {
    console.error("Error:", error);
    alert("Update Fail1");
    window.location.reload();
  }
};
var addListHtmlCb = (data) => {
  var i = 1;
  bodyTable.innerHTML = data.result.docs
    .map((e) => {
      return `
      <tr>
        <th scope=" row">${i++}</th>
        <td>${e.lastName}</td>
        <td>${e.firstName}</td>
        <td>${e.email}</td>
        <td>${e.hobbies || ""} </td>
        <td>${e.workLocation || ""}</td>
        <td><a class="text-danger delete" onclick='deleteUser(this)' data-id=${
          e._id
        }>delete</a></td>
        <td><a class="text-info  update" onclick='updateUser(this)' data-id=${
          e._id
        }>Update</a></td>
    </tr>
  `;
    })
    .join(" ");
};
function deleteUser(e) {
  deleteUserById({ userId: e.dataset.id });
}
function updateUser(e) {
  var modal = document.getElementById("btn-modal");
  var updates = document.querySelectorAll(".update");
  var token = localStorage.getItem("token");
  if (!token) {
    alert("Require login");
    return;
  }

  var id = e.dataset.id;
  var tds = e.parentElement.parentElement.querySelectorAll("td");
  firstName.value = tds[0].innerText;
  lastName.value = tds[1].innerText;
  email.value = tds[2].innerText;
  hobbies.value = tds[3].innerText;
  workLocation.value = tds[4].innerText;
  userId = id;
  modal.click();
}

(function loadDataInTable() {
  //  EventId was declared in tag <script> top
  const params = new URLSearchParams(window.location.search);
  fetchUserEvent(+params.get("page") || 1);
})();

const deleteUserById = (data) => {
  if (!confirm("Are you sure ? ") == true) {
    return;
  }
  fetch(`${host}/user/delete`, {
    method: "DELETE", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.status) {
        alert("Delete error");
        return;
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
const updateUserForm = (data) => {
  console.log(data);
};
function setPagination({ result }) {
  var liPrevous = `
   <li class="page-item ${result.hasPrevPage ? "" : "disabled"}">
    <a class="page-link" href="?page=${result.page - 1}" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
      <span class="sr-only">Previous</span>
    </a>
  </li>`;
  var liNext = `  
  <li class="page-item ${result.hasNextPage ? "" : "disabled"}">
    <a class="page-link" href="?page=${result.page + 1}" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
    </a>
  </li>`;
  var liNumber = "";
  for (let index = 0; index < result.totalPages; index++) {
    liNumber += ` <li class="page-item ${
      index == result.page - 1 ? "active" : ""
    }"><a class="page-link"  href="?page=${index + 1}">${index + 1}</a></li>`;
  }
  pagination.innerHTML = liPrevous + liNumber + liNext;
}

window.onload = function () {
  // (function deleteUser(e) {
  //   var deleteList = document.querySelectorAll(".delete");
  //   console.log(deleteList);
  //   deleteList.forEach((e) => {
  //     e.addEventListener("click", (e) => {
  //       deleteUserById({ userId: e.target.dataset.id });
  //     });
  //   });
  // })();
  // (function update() {
  //   var modal = document.getElementById("btn-modal");
  //   var updates = document.querySelectorAll(".update");
  //   var token = !localStorage.getItem("token");
  //   updates.forEach((e) => {
  //     e.addEventListener("click", (e) => {
  //       if (!token) {
  //         alert("Require login");
  //         return;
  //       }
  //       var id = e.target.dataset.id;
  //       var tds = e.target.parentElement.parentElement.querySelectorAll("td");
  //       var firstName = tds[0].innerText;
  //       var lastName = tds[1].innerText;
  //       var email = tds[2].innerText;
  //       modal.click();
  //     });
  //   });
  // })();
  (function clickPagination() {
    var a = document.querySelectorAll(".page-link");
    a.forEach((e) => {
      e.addEventListener("click", (e) => {
        e.preventDefault();
        var page = e.target.dataset.page;
        fetchUserEvent(page);
      });
    });
  })();
};

//  update User
formModal.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    lastName: lastName.value,
    firstName: firstName.value,
    email: email.value,
    workLocation: workLocation.value,
    hobbies: hobbies.value,
    _id: userId,
  };
  await fetchUpDateUser(data);
});
