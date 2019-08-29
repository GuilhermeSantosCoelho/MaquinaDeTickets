var refFilmes = firebase.database().ref("Filmes");

//Função que exibe os filmes na página inicial
refFilmes.once("value").then(function (snapshot) {
    var feed = document.getElementById('feedFilmes');
    snapshot.forEach(function (childSnapshot) {
        feed.innerHTML += `	<div onclick="abrirFilme(this)" id=` + childSnapshot.key + ` class="divCartaz">
								<img class="imagemFilme" src="images/` + childSnapshot.child("imagem").val() + `"/>
								<h4>` + childSnapshot.child("nome").val() + ` - ` + childSnapshot.child("ano").val() + `</h4>
								<h4> Duração: ` + calcularDuracao(childSnapshot.child("duracao").val()) + `</h4>`;
    });
});

function abrirFilme(filme) {
    sessionStorage.setItem("filme", filme.id);
    window.location = ("comprar.html");
}

//Função para calcular a duracao de minutos para horas
function calcularDuracao(duracao) {
    var resultado = 0;
    while (duracao >= 60) {
        resultado += 1;
        duracao -= 60;
    }
    return resultado + "h" + (duracao < 10 ? "0" + duracao  + "min" : duracao + "min");
}
