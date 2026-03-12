const btnCargar = document.getElementById("btnCargar");
const selectUsers = document.getElementById("users");
const divPosts = document.getElementById("posts");

btnCargar.addEventListener("click", () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(usuarios => {
        let texto = "";
        usuarios.forEach(usr => {
            texto += `<option value="${usr.id}">${usr.name}</option>`
        });
        selectUsers.innerHTML = texto;
      })
});

selectUsers.addEventListener("change",() => {
  fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(posts => {
        let texto = "";
        posts.forEach(post => {
          if(selectUsers.value == post.userId) {
            texto += `
              <div class="card shadow-sm p-3 mb-5 bg-body-tertiary rounded" style="width: 90%; margin: 1rem;">
                <div class="card-body">
                  <h5 class="card-title">${post.title}</h5>
                  <li class="list-group-item">Ciudad: ${post.body}</li>
                  <br>

                  <button id="btnComentarios${post.id}" type="button" class="btn btn-outline-primary" style="max-width: fit-content; margin: 4px;">Comentarios</button>

                  <div id="divAgregar${post.id}" style="margin: 1rem; justify-content: center;">
                    <h5 class="card-title">Agregar Comentario</h5>
                    
                    <label for="inputName${post.id}">Name: </label>
                    <input type="text" id="inputName${post.id}">

                    <label for="inputEmail${post.id}">Email: </label>
                    <input type="text" id="inputEmail${post.id}">

                    <label for="inputBody${post.id}">Body: </label>
                    <input type="text" id="inputBody${post.id}">

                    <button id="btnAgregar${post.id}" type="button" class="btn btn-outline-primary" style="max-width: fit-content; margin: 4px;">Agregar</button>
                  </div>

                  <ul class="list-group list-group-flush" id="ulComentarios${post.id}"></ul>
                </div>
              </div>
            `;
          }
        });

        divPosts.innerHTML = texto;

        posts.forEach(post => {
          if(selectUsers.value == post.userId) {
            const listaComentarios = document.getElementById(`ulComentarios${post.id}`);
            listaComentarios.style.display = "none";
            const divAgregar = document.getElementById(`divAgregar${post.id}`);
            divAgregar.style.display = "none";

            let btnComentarios = document.getElementById(`btnComentarios${post.id}`);
            btnComentarios.addEventListener("click", () => {
              if (listaComentarios.style.display == "flex") {
                listaComentarios.style.display = "none";
                divAgregar.style.display = "none";
                listaComentarios.innerHTML = "";
              } else {
                listaComentarios.style.display = "flex";
                divAgregar.style.display = "block";
                fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                  .then(response => response.json())
                  .then(comentarios => {
                    let textoComentarios = "";
                    comentarios.forEach(comentario => {
                      textoComentarios += `
                        <li class="list-group-item">
                          <h5>${comentario.name}</h5>
                          <h6>${comentario.email}</h6>
                          ${comentario.body}
                        </li>
                      `;
                    });
                    listaComentarios.innerHTML = textoComentarios;
                  });
              }
            });

            let btnAgregar = document.getElementById(`btnAgregar${post.id}`);
            btnAgregar.addEventListener("click", () => {
              const Name = document.getElementById(`inputName${post.id}`);
              const Email = document.getElementById(`inputEmail${post.id}`);
              const Body = document.getElementById(`inputBody${post.id}`);

              fetch('https://jsonplaceholder.typicode.com/comments', {
                method: 'POST',
                body: JSON.stringify({
                  postId: post.id,
                  name: Name.value,
                  email: Email.value,
                  body: Body.value,
                }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
              })
                .then((response) => response.json())
                .then((json) => {
                  console.log(json);
                  let textoComentarios = `
                    <li class="list-group-item">
                      <h5>${json.name}</h5>
                      <h6>${json.email}</h6>
                      ${json.body}
                      </li>
                    `;
                  listaComentarios.innerHTML += textoComentarios;
                });
            });
          }
        });
      });
      
});