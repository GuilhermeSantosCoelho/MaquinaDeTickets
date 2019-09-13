var clienteKey = sessionStorage.getItem("cliente");
var refCliente = firebase.database().ref("Clientes/-" + sessionStorage.getItem("cliente"));

if (clienteKey == null) {
    window.location = "index.html";
} else {
    refCliente.once("value").then(function (snapshot) {
        var ingressosMeia = snapshot.child("ingressosMeia").val();
        var ingressosInteira = snapshot.child("ingressosInteira").val();

        firebase.database().ref("Ingresso").once("value").then(function (snapshot) {
            var precoTotal = 0;
            var precoMeia = snapshot.child("Meia").val();
            var precoInteira = snapshot.child("Inteira").val();
            precoTotal = (calcularPreco(ingressosMeia, precoMeia) + calcularPreco(ingressosInteira, precoInteira));
            document.getElementById('precoTotal').innerHTML = "R$" + precoTotal + ",00";
        });
    });

}

function digitarSenha(botao) {
    var senha = document.getElementById('senhaLabel').innerHTML.toString();

    if (senha.length < 4) {
        document.getElementById('senhaLabel').innerHTML += '*';
    }
}

function calcularPreco(ingressos, preco) {
    return ingressos * preco;
}

function cancelarPagamento() {
    refCliente.once("value").then(function (snapshot) {
        var sala = snapshot.child("sala").val();
        var refCadeirasSelecionadas = firebase.database().ref("CadeirasSelecionadas/" + sala);

        refCadeirasSelecionadas.once("value").then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.child("cliente").val() == clienteKey) {
                    var cadeira = childSnapshot.key;
                    refCadeirasSelecionadas.child(cadeira).remove();
                }
            });
            refCliente.remove();
            sessionStorage.setItem("cliente", null);
            window.location = "index.html";
        });
    });
}

function finalizarPagamento() {
    var senha = document.getElementById('senhaLabel').innerHTML.toString();

    if (senha.length != 4) {
        alerta("A senha deve possuir 4 caracteres.");
    } else {
        refCliente.child("pago").set(1);
        window.location = "ingressos.html";
    }
}

function alerta(texto) {
    var alerta = document.getElementById("alerta");
    alerta.style.paddingTop = "8px";
    alerta.style.height = "50px";
    alerta.innerHTML = texto;
    setTimeout(function () {
        alerta.innerHTML = "";
        alerta.style.paddingTop = "0px";
        alerta.style.height = "0px";
    }, 3000);
}
