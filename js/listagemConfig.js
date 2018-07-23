//Referência para acessar variaveis internas
const self = this;

window.onload = function () {
    self.hoje = new Date();
    self.hoje.setHours(00, 00, 00, 00);

    self.itensTabelaCorpo = $("#itensTabelaCorpo");

    if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "") {
        localStorage.itens = [];
        self.itensTabelaCorpo.append($('<tr></tr>').load("itemTemplate.html"));
    }

    let registrosChecagem = false;

    if(localStorage.itens != "") {
        for (let item of JSON.parse(localStorage.itens)) {
            if(item.ativo === true){
                registrosChecagem = true;
                let novoItem = $('<tr></tr>').load("itemTemplate.html", function () {
                    novoItem[0].children[0].firstElementChild.value = item.nomeDoItem;
                    novoItem[0].children[1].firstElementChild.value = item.unidadeMedida;
                    novoItem[0].children[2].children[0].value = item.quantidade;
                    novoItem[0].children[2].children[1].value = item.unidadeAbreviatura;
                    novoItem[0].children[3].firstElementChild.value = item.preco;
                    novoItem[0].children[4].firstElementChild.checked = item.perecivel;
                    novoItem[0].children[5].firstElementChild.value = item.validade;
                    novoItem[0].children[6].firstElementChild.value = item.fabricacao;
                    novoItem[0].children[7].children[0].setAttribute("onclick", "itemEditar('" + item.nomeDoItem + "', '" + item.fabricacao + "')");
                    novoItem[0].children[7].children[1].setAttribute("onclick", "itemRemover('" + item.nomeDoItem + "', '" + item.fabricacao + "')");
                    
                    if (dataInferior(item.validade)) { 
                        novoItem[0].children[5].firstElementChild.classList.remove("form-control");
                        novoItem[0].children[5].firstElementChild.classList.add("btn");
                        novoItem[0].children[5].firstElementChild.classList.add("btn-danger");
                        novoItem[0].children[5].firstElementChild.classList.add("disabled");
                    }

                    self.itensTabelaCorpo.append(novoItem);
                });
            }
        }
    }

    if(!registrosChecagem) {
        $("table").remove();
        $("#tabelaVazia").append("<h4>Não há itens cadastrados</h4>")
    }
}

dataInferior = (validade) => new Date(validade + "T00:00:00") < self.hoje;

itemEditar = (nomeDoItem,fabricacao) => {
    window.location.href = "editar.html?nomeDoItem=" +nomeDoItem+"&fabricacao="+fabricacao;
} 

itemRemover = (nomeDoItem, fabricacao) => {
    if(confirm("Realmente deseja excluir este item?")) {
        let removido = false;
        
        let itens = JSON.parse(localStorage.itens);
        
        for (let item of itens) {
            if(item.nomeDoItem == nomeDoItem && item.fabricacao == fabricacao)
            {
                item.ativo = false;
                removido = true;
            }
        }
        
        if(removido == true)
        {
            alert("Item removido com sucesso!")
            localStorage.itens = JSON.stringify(itens);
        }
        else
        alert("Erro ao remover, contate um administrador.");
        
        window.location.reload();
    }
}