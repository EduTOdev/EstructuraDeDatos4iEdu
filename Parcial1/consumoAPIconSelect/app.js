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

            let btnComentarios = document.getElementById(`btnComentarios${post.id}`);
            btnComentarios.addEventListener("click", () => {
              if (listaComentarios.style.display == "flex") {
                listaComentarios.style.display = "none";
                listaComentarios.innerHTML = "";
              } else {
                listaComentarios.style.display = "flex";
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
          }
        });
      });
      
});