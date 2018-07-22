const self = this;

window.onload = function () {
        self.hoje = new Date();
        self.hoje.setHours(00, 00, 00, 00);

        self.itensTabelaCorpo = $("#itensTabelaCorpo");

        for(let item of JSON.parse(localStorage.itens)) {
            // console.log(item);
            let novoItem = $('<tr></tr>').load("itemTemplate.html",function() {
                console.dir(novoItem[0].children[0]);
                // novoItem[0].children[0].firstElementChild.value = item.nomeDoItem;
                // novoItem[0].children[1].firstElementChild.value = item.unidadeMedida;
                // novoItem[0].children[2].children[0].value = item.quantidade;
                // novoItem[0].children[2].children[1].value = item.unidadeAbreviatura;
                // novoItem[0].children[3].firstElementChild.value = item.preco;
                // novoItem[0].children[4].firstElementChild.value = item.perecivel;
                // novoItem[0].children[5].firstElementChild.value = item.validade;
                // novoItem[0].children[6].firstElementChild.value = item.fabricacao;
            });
            
            // console.log(novoItem);
        }
        // self.itensTabelaCorpo.append(novoItem);

//     if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "")
//         localStorage.itens = [];
//     else 
//         self.lista.innerHTML = JSON.parse(localStorage.itens)[0].ativo;

//     //agora só fazer o map
}