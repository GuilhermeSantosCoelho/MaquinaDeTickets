var filme = sessionStorage.getItem("filme");
var refFilme = firebase.database().ref("Filmes/" + filme);
var sala;

if(filme == null){
    window.location = "index.html";
}else{

    function finalizarCompra() {
        var ingressosMeia = parseInt(document.getElementById("numIngressosMeia").innerHTML);
        var ingressosInteira = parseInt(document.getElementById("numIngressosInteira").innerHTML);
        if(ingressosMeia > 0 || ingressosInteira > 0){
            var clienteRef = firebase.database().ref('Clientes');
            var newclienteRef = clienteRef.push();
            var quantidade = ingressosInteira + ingressosMeia;
            newclienteRef.set({ filme:filme, 
                ingressosMeia:ingressosMeia, 
                ingressosInteira:ingressosInteira, 
                quantidadeIngressos:quantidade,
                sala:sala
            });
            var codigo = newclienteRef.toString().split("/-");
            sessionStorage.setItem("cliente", codigo[1]);
            window.location = "assentos.html";
        }else{
            var alerta = document.getElementById("alerta");
            alerta.style.paddingTop = "8px";
            alerta.style.height = "50px";
            alerta.innerHTML = "Nenhum ingresso selecionado!";
            setTimeout(function () {
                alerta.innerHTML = "";
                alerta.style.paddingTop = "0px";
                alerta.style.height = "0px";
            }, 3000);
        }
    }

    //Função que exibe os filmes na página inicial
    refFilme.once("value").then(function (snapshot) {
        document.getElementById('nomeFilme').innerHTML = snapshot.child("nome").val() + " - " + snapshot.child("ano").val();
        document.getElementById('detalhesFilme').innerHTML = snapshot.child("duracao").val() + "min.";
        sala = snapshot.child("sala").val();
    });

    function adicionarIngresso(numIngressos) {
        var ingressosMeia = (parseInt(this.document.getElementById(numIngressos).innerHTML));
        this.document.getElementById(numIngressos).innerHTML = (ingressosMeia + 1);
    }

    function removerIngresso(numIngressos) {
        var ingressosMeia = (parseInt(this.document.getElementById(numIngressos).innerHTML));
        if (ingressosMeia > 0) this.document.getElementById(numIngressos).innerHTML = (ingressosMeia - 1);
    }
        
}