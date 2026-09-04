// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const title = document.querySelector("#title").value;
  const message = document.querySelector("#message").value;
  const status = document.querySelector("#status").value;
  const due = document.querySelector("#due").value;

  const currentDate = new Date();
  const dueDate = new Date(due);
  const days = Math.round((dueDate - currentDate) / (1000 * 60 * 60 * 24));
  let important = "no";

  if (status === "incomplete" && days < 3) important = "yes";

  const response = await fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, message, status, due, important }),
  });

  addData(await response.json());
  console.log(response.status);
};

window.onload = function () {
  const button = document.querySelector("button");
  button.onclick = submit;
  getData();
};

const addData = function (data) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach((note) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${note.title}</td>
      <td>${note.message}</td>
      <td>${note.status}</td>
      <td>${note.due}</td>
      <td>${note.important}</td>
      <td><button class="delete" onclick="deleteData(this)">Delete</button></td>
    `;

    tbody.appendChild(tr);
  });
};

const deleteData = async function (button) {
  const row = button.parentElement.parentElement;
  const title = row.firstElementChild.textContent;

  const response = await fetch("/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  getData(await response.json());
};

const getData = async function () {
  const response = await fetch("/data");
  const data = await response.json();
  addData(data);
};
