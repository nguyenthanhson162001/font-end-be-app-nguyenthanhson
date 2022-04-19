var url = "https://13.213.68.138:3000";
var lastName = document.getElementById("lastName");
var firstName = document.getElementById("firstName");
var email = document.getElementById("email");
var workLocation = document.getElementById("workLocation");
var hobbies = document.getElementById("hobbies");
var formEventA = document.getElementById("formEventA");
var formEventB = document.getElementById("formEventB");
var errorHeading = document.querySelector("#error h4");
var errorSub = document.querySelector("#error p");

//  Submit event A
(() => {
  if (!formEventA) return;
  formEventA.addEventListener("submit", (e) => {
    const data = {
      lastName: lastName.value,
      firstName: firstName.value,
      email: email.value,
      workLocation: workLocation.value,
    };
    e.preventDefault();
    fetchRegisterEvent(`${url}/register-event/event-a`, data);
  });
})();

//  Submit event B
(() => {
  if (!formEventB) return;
  formEventB.addEventListener("submit", (e) => {
    const data = {
      lastName: lastName.value,
      firstName: firstName.value,
      email: email.value,
      hobbies: hobbies.value,
    };
    e.preventDefault();
    fetchRegisterEvent(`${url}/register-event/event-b`, data);
  });
})();

const fetchRegisterEvent = (url, data) => {
  fetch(url, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.status) {
        errorHeading.innerText = "Error";
        errorSub.innerText = data.error.message;
        errorHeading.parentElement.className = "alert alert-danger mt-4 mb-3";
        return;
      }
      errorHeading.innerText = "Success";
      errorSub.innerText = "";
      errorHeading.parentElement.className = "alert alert-success mt-4 mb-3";
    })
    .catch((error) => {
      console.error("Error:", error);
      errorHeading.innerText = "Error";
      errorSub.innerText = error;
      errorHeading.parentElement.className = "alert alert-danger mt-4 mb-3";
    });
};
