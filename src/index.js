let addToy = false;
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const submitBtn = document.querySelector(".add-toy-form");

  submitBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    submitToy(e);
    loadCards();
    submitBtn.reset();
  });

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  loadCards();
});

function loadCards() {
  fetch("http://localhost:3000/toys")
    .then((resp) => resp.json())
    .then((toys) => populateCards(toys))
    .then(() => attachLikeEvents())
    .catch((err) => console.log(err, "Could not load cards"));
}

function populateCards(toys) {
  const toyCollection = document.getElementById("toy-collection");
  toys.map((toy) => toyCollection.appendChild(createCard(toy)));
}

function createCard(toy) {
  const card = document.createElement("div");
  card.className = "card";
  card.id = toy.id;

  const header = document.createElement("h2");
  header.className = "card-header";
  header.textContent = toy.name;

  const img = document.createElement("img");
  img.className = "toy-avatar";
  img.src = toy.image;
  img.alt = toy.name;

  const description = document.createElement("p");
  description.className = "card-description";
  description.textContent = `${toy.likes} likes`;

  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.textContent = "Like ♥";

  card.appendChild(header);
  card.appendChild(img);
  card.appendChild(description);
  card.appendChild(likeBtn);

  return card;
}

function submitToy(e) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0,
    }),
  })
    .then((resp) => resp.json())
    .then((data) => data)
    .catch((err) => console.log(err, "Could not post toy to server"));
}

function updateLike(e) {
  const card = e.target.parentElement;
  const description = card.querySelector(".card-description");
  const likeCount = Number(description.textContent.split(" ")[0]) + 1;

  fetch(`http://localhost:3000/toys/${e.target.parentElement.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      likes: likeCount,
    }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      description.textContent = `${likeCount} likes`;
    })
    .catch((err) => console.log(err, "Could not update like"));
}

function attachLikeEvents() {
  const likeBtns = document.querySelectorAll(".like-btn");
  likeBtns.forEach((btn) => {
    btn.addEventListener("click", updateLike);
  });
}
