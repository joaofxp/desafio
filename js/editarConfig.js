const self = this;
const parametros = parametrosPegar(window.location.href);

window.onload = function () {
    self.hoje = new Date();
    self.hoje.setHours(00, 00, 00, 00);

    if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "") {
        localStorage.itens = [];
        alert("Ocorreu um problema, redirecionando...");
        window.location.replace("listagem.html");
    }

    self.nomeDoItem = document.getElementsByName("nomeDoItem")[0];
    self.unidadeMedida = document.getElementsByName("unidadeMedida")[0];
    self.quantidade = document.getElementsByName("quantidade")[0];
    self.unidadeAbreviatura = document.getElementsByName("unidadeAbreviatura")[0];
    self.preco = document.getElementsByName("preco")[0];
    self.perecivel = document.getElementsByName("perecivel")[0];
    self.validade = document.getElementsByName("validade")[0];
    self.fabricacao = document.getElementsByName("fabricacao")[0];

    
    if (localStorage.itens != "") {
        for (let item of JSON.parse(localStorage.itens)) {
            if (item.fabricacao == parametros.fabricacao && item.nomeDoItem == parametros.nomeDoItem && item.ativo === true) {
                self.nomeDoItem.value = item.nomeDoItem;
                self.unidadeMedida.value = item.unidadeMedida;
                self.quantidade.value = item.quantidade;
                self.unidadeAbreviatura.value = item.unidadeAbreviatura;
                self.preco.value = item.preco;
                self.perecivel.checked = item.perecivel;
                self.validade.value = item.validade;
                self.fabricacao.value = item.fabricacao;
        
            }
        }
    }
}

serializar = () => {
    let itens = JSON.parse(localStorage.itens);
    
    for (let item of itens) {
        if (item.fabricacao == parametros.fabricacao && item.nomeDoItem == parametros.nomeDoItem && item.ativo === true) {
            item.nomeDoItem = self.nomeDoItem.value;
            item.unidadeMedida = self.unidadeMedida.value;
            item.quantidade = self.quantidade.value;
            item.unidadeAbreviatura = self.unidadeAbreviatura.value;
            item.preco = self.preco.value;
            item.perecivel = self.perecivel.checked;
            item.validade = self.validade.value;
            item.fabricacao = self.fabricacao.value;
            item.ativo = true;
        }
    }

    localStorage.itens = JSON.stringify(itens);
    alert("Item editado com sucesso!");
}

limitarDataFabricação = () => {
    if (self.validade.hasAttribute("required"))
        self.fabricacao.setAttribute("max", self.validade.value);
}

dataInferior = () => new Date(self.validade.value + "T00:00:00") < hoje;

produtoVencido = () => console.log("O produto encontra-se vencido.");

validadeObrigatoria = (perecivel) => {
    if (perecivel) {
        self.validade.setAttribute("required", "");
        limitarDataFabricação(self.validade.value);
    } else
        self.validade.removeAttribute("required");
}

mascarar = () => $("input[name='preco']").maskMoney();

quantidadeConfigurar = (quantidade) => {    
    self.quantidade.setAttribute("step", "0.001")
    self.unidadeAbreviatura.setAttribute("value", "");

    switch (quantidade) {
        case "1":
            self.unidadeAbreviatura.value = "lt";
            break;
        case "2":
            self.unidadeAbreviatura.value = "kg";
            break;
        case "3":
            self.unidadeAbreviatura.value = "un";
            self.quantidade.setAttribute("step", "1")
            break;
        default:
            break;
    }
}

function parametrosPegar(url) {
    // get query string from url (optional) or window
    let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    let obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        let arr = queryString.split('&');

        for (let i = 0; i < arr.length; i++) {
            // separate the keys and the values
            let a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            let paramNum = undefined;
            let paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            // paramName = paramName.toLowerCase();
            // paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}