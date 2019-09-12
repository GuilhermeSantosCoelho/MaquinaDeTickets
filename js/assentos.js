var letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
var clienteKey = sessionStorage.getItem("cliente");
var refCliente = firebase.database().ref("Clientes/-" + sessionStorage.getItem("cliente"));

if (clienteKey == null) {
    window.location = "index.html";
} else {
    refCliente.once("value").then(function (snapshot) {
        var refFilme = firebase.database().ref("Filmes/" + snapshot.child("filme").val());
        var refSalas = firebase.database().ref("Salas/" + snapshot.child("sala").val());
        var refCadeiras = firebase.database().ref("CadeirasOcupadas/" + snapshot.child("filme").val());
        var refCadeirasSelecionadas = firebase.database().ref("CadeirasSelecionadas/" + snapshot.child("filme").val());

        refFilme.once("value").then(function (snapshot) {
            document.getElementById('nomeFilme').innerHTML = snapshot.child("nome").val();
            document.getElementById('detalhesFilme').innerHTML = "Duração: " + calcularDuracao(snapshot.child("duracao").val());
        });

        //Função que exibi as cadeiras da sala
        refSalas.once("value").then(function (snapshot) {
            var linhas = snapshot.child("linhas").val();
            var colunas = snapshot.child("colunas").val();
            for (var j = 0; j < colunas; j++) document.getElementById('divAssentos').innerHTML += "<label class='numeroAssento'>" + (j + 1) + "</label>";
            document.getElementById('divAssentos').innerHTML += "<br>";
            for (var i = 1; i <= linhas; i++) {
                document.getElementById('divAssentos').innerHTML += "<label class='letraAssento'>" + letras[i - 1] + "</label>";
                for (var j = 0; j < colunas; j++) {
                    document.getElementById('divAssentos').innerHTML += "<div class='assento' onclick='selecionarCadeira(this)' id='" + letras[i - 1] + (j + 1) + "'></div>";
                }
                document.getElementById('divAssentos').innerHTML += "<br>";
            }
        });

        //Função que exibe as cadeiras que estão selecionadas
        refCadeirasSelecionadas.on("child_added", function (childSnapshot, prevChildKey) {
            childSnapshot.forEach(function (cadeira) {
                var cadeira = childSnapshot.key;

                if (childSnapshot.child("cliente").val() == clienteKey) {
                    document.getElementById(cadeira).style.backgroundColor = "yellow";
                } else {
                    document.getElementById(cadeira).style.backgroundColor = "red";
                }
            });
        });

        refCadeirasSelecionadas.on("child_removed", function (oldChildSnapshot) {
            document.getElementById(oldChildSnapshot.key).style.backgroundColor = "#2de089";
        });

        refCadeiras.once("value").then(function (snapshot) {
            if (snapshot.exists()) {
                snapshot.forEach(function (childSnapshot) {
                    var cadeira = childSnapshot.key;
                    document.getElementById(cadeira).style.backgroundColor = "red";
                    console.log(cadeira);
                });
            } else {
                alerta("Nenhuma cadeira ocupada.");
            }
        });

    });

    //Função que permite o cliente reservar uma cadeira do cinema
    function selecionarCadeira(cadeira) {
        refCliente.once("value").then(function (snapshot) {
            var filme = snapshot.child("filme").val();
            var refCadeirasSelecionadas = firebase.database().ref("CadeirasSelecionadas/" + filme).child(cadeira.id);
            var refCadeirasOcupadas = firebase.database().ref("CadeirasOcupadas/" + filme).child(cadeira.id);
            var ingressos = snapshot.child("quantidadeIngressos").val();

            refCadeirasOcupadas.once("value").then(function (snapshot) {
                if (!snapshot.exists()) {
                    refCadeirasSelecionadas.once("value").then(function (snapshot) {
                        if (!snapshot.exists()) {
                            reservarAssento(cadeira.id, clienteKey);
                        } else {
                            if (snapshot.child("cliente").val() == clienteKey) {
                                refCadeirasSelecionadas.remove().then(function () {
                                    document.getElementById(cadeira.id).style.backgroundColor = "#2de089";
                                    ingressos += 1;
                                    refCliente.child("quantidadeIngressos").set(ingressos);
                                });
                            } else {
                                alerta("Cadeira ocupada!");
                            }
                        }
                    });
                } else {
                    alerta("Cadeira ocupada!");
                }
            });

        });
    }

    function reservarAssento(assento, cliente) {
        refCliente.once("value").then(function (snapshot) {
            var ingressos = snapshot.child("quantidadeIngressos").val();
            var filme = snapshot.child("filme").val();
            if (ingressos > 0) {
                firebase.database().ref("CadeirasSelecionadas/" + filme).child(assento).set({ cliente: cliente });
                ingressos -= 1;
                refCliente.child("quantidadeIngressos").set(ingressos);
            }
        });
    }

    function cancelarComprar() {
        refCliente.once("value").then(function (snapshot) {
            var sala = snapshot.child("sala").val();
            var refCadeirasSelecionadas = firebase.database().ref("CadeirasSelecionadas/" + filme);

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

    function finalizarCompra() {
        refCliente.once("value").then(function (snapshot) {
            var quantidadeIngressos = snapshot.child("quantidadeIngressos").val();

            if (quantidadeIngressos != 0) {
                alerta("Você não selecionou todas as cadeiras.");
            } else {
                window.location = "pagamento.html";
            }
        });
    }

    //Função para calcular a duracao de minutos para horas
    function calcularDuracao(duracao) {
        var resultado = 0;
        while (duracao >= 60) {
            resultado += 1;
            duracao -= 60;
        }
        return resultado + "h" + (duracao < 10 ? "0" + duracao + "min" : duracao + "min");
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


