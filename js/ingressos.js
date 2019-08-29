var clienteKey = sessionStorage.getItem("cliente");
var refCliente = firebase.database().ref("Clientes/-" + sessionStorage.getItem("cliente"));

console.log(clienteKey);

if (clienteKey == null) {
    window.location = "index.html";
} else {
    refCliente.once("value").then(function (snapshot) {
        var refFilme = firebase.database().ref("Filmes/" + snapshot.child("filme").val());
        var refCadeirasSelecionadas = firebase.database().ref("CadeirasSelecionadas/" + snapshot.child("filme").val());

        refFilme.once("value").then(function (filmeSnapshot){
            var filme = filmeSnapshot.child("nome").val();
            var filmeData = filmeSnapshot.child("data").val();
            var filmeHora = filmeSnapshot.child("hora").val();
            refCadeirasSelecionadas.once("value").then(function (cadeirasSelecionadasSnapshot){
                cadeirasSelecionadasSnapshot.forEach(function (cadeira){
                    console.log("asdasd");
                    if(cadeira.child("cliente").val() == clienteKey){
                        firebase.database().ref("CadeirasOcupadas/" + filmeSnapshot.key).child(cadeira.key).set({ cliente:clienteKey });
                        document.getElementById("ingressos").innerHTML += 
                        `<div class="ingresso">
                            <div class="nomeIngresso">` + filme + `</div>
                            <div class="dataIngresso">` + filmeData + `</div><br>
                            <div class="horaIngresso">` + filmeHora + `</div>
                            <div class="fileiraIngresso">` + cadeira.key.charAt(0) + `</div>
                            <div class="assentoIngresso">` + cadeira.key.charAt(1) + `</div>
                        </div>`;
                        refCadeirasSelecionadas.child(cadeira.key).remove();
                    }
                });
                refCliente.remove();
            });
        });
    });
}