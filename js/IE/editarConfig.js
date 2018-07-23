/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*    @author João Francisco - https://github.com/joaofxp                  *
*    @updated 23/07/2018                                                  *
*    Pacote: Desafio Front-End                                            *
*                                                                         *
*    Copyright (C) 2018 UNIVALI - Universidade do Vale do Itajaí          *
*                  https://univali.br                                     *
*                  0800 723 1300                                          *
*                                                                         *
*    Este  programa  é  software livre, você pode redistribuí-lo e/ou     *
*    modificá-lo sob os termos da Licença Pública Geral GNU, conforme     *
*    publicada pela Free  Software  Foundation,  tanto  a versão 2 da     *
*    Licença   como  (a  seu  critério)  qualquer  versão  mais  nova.    *
*                                                                         *
*    Este programa  é distribuído na expectativa de ser útil, mas SEM     *
*    QUALQUER GARANTIA. Sem mesmo a garantia implícita de COMERCIALI-     *
*    ZAÇÃO  ou  de ADEQUAÇÃO A QUALQUER PROPÓSITO EM PARTICULAR. Con-     *
*    sulte  a  Licença  Pública  Geral  GNU para obter mais detalhes.     *
*                                                                         *
*    Você  deve  ter  recebido uma cópia da Licença Pública Geral GNU     *
*    junto  com  este  programa. Se não, escreva para a Free Software     *
*    Foundation,  Inc.,  59  Temple  Place,  Suite  330,  Boston,  MA     *
*    02111-1307, USA.                                                     *
*                                                                         *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/


//Referência para acessar variaveis internas
var self = this;
//Referência para os parâmetros que estão na URL
var parametros = parametrosPegar(window.location.href);

window.onload = function () {
    //Referência para o dia de hoje
    self.hoje = new Date();
    //colocamos o horário do dia de hoje como meia noite para futuras comparações
    self.hoje.setHours(00, 00, 00, 00);

    //verificamos se o local storage já existe ou está vazio
    if (localStorage.getItem("itens") === null || localStorage.getItem("itens") === "") {
        localStorage.itens = [];
        alert("Ocorreu um problema, redirecionando...");
        window.location.replace("listagem.html");
    }

    //Referência para o input que contém o nome do item
    self.nomeDoItem = document.getElementsByName("nomeDoItem")[0];
    //Referência para o input que contém o unidade de medida
    self.unidadeMedida = document.getElementsByName("unidadeMedida")[0];
    //Referência para o input que contém o quantidade
    self.quantidade = document.getElementsByName("quantidade")[0];
    //Referência para o input que contém a unidade de abreviatura
    self.unidadeAbreviatura = document.getElementsByName("unidadeAbreviatura")[0];
    //Referência para o input que contém o preço
    self.preco = document.getElementsByName("preco")[0];
    //Referência para o input que contém se é perecível
    self.perecivel = document.getElementsByName("perecivel")[0];
    //Referência para o input que contém a validade
    self.validade = document.getElementsByName("validade")[0];
    //Referência para o input que contém a fabricação
    self.fabricacao = document.getElementsByName("fabricacao")[0];

    //Caso a lista de itens não esteja vazia, carregamos as informações do item
    if (localStorage.itens != "") {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = JSON.parse(localStorage.itens)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                //Verificamos se os parametros coincidem com um item da lista
                if (item.fabricacao == parametros.fabricacao && item.nomeDoItem == decodeURI(parametros.nomeDoItem) && item.ativo === true) {
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
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
};

//função responsável pela edição de um item
serializar = function serializar() {
    //Referência para os itens guardados no local storage
    var itens = JSON.parse(localStorage.itens);

    //encontrar o item que será editado e alterar os valores
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = itens[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            if (item.fabricacao == parametros.fabricacao && item.nomeDoItem == decodeURI(parametros.nomeDoItem) && item.ativo === true) {
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

        //Salvar a nova lista de itens
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    localStorage.itens = JSON.stringify(itens);
    //Avisar sobre o status da edição
    alert("Item editado com sucesso!");
};

//Limita a data de fabricação caso seja um produto perecível
limitarDataFabricacao = function limitarDataFabricacao() {
    if (self.validade.hasAttribute("required")) self.fabricacao.setAttribute("max", self.validade.value);
};

//comparar se uma data é inferior a outra
dataInferior = function dataInferior() {
    return self.validade.value.substring(0, 4) > 1753 ? new Date(self.validade.value + "T00:00:00") < self.hoje : false;
};

//alertar o usuario sobre a validade do produto
produtoVencido = function produtoVencido() {
    return console.log("O produto encontra-se vencido.");
};

//tornamos validade obrigatória caso seja um produto perecível
validadeObrigatoria = function validadeObrigatoria(perecivel) {
    if (perecivel) {
        self.validade.setAttribute("required", "");
        limitarDataFabricacao(self.validade.value);
    } else self.validade.removeAttribute("required");
};

//mascaramos o input de dinheiro
mascarar = function mascarar() {
    return $("input[name='preco']").maskMoney();
};

//configurar a unidade de abreviatura
quantidadeConfigurar = function quantidadeConfigurar(quantidade) {
    //definimos que o número possui três casas decimais
    self.quantidade.setAttribute("step", "0.001");
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
            //definimos que o número não possui casas decimais
            self.quantidade.setAttribute("step", "1");
            break;
        default:
            break;
    }
};

//Função responsável por pegar os parametros da URL
function parametrosPegar(url) {
    // Pegamos os parametros da url
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // guardamos as informações no obj
    var obj = {};

    // Se houver parametros
    if (queryString) {

        // Removemos tudo o que há após o #, pois não é parte da consulta
        queryString = queryString.split('#')[0];

        // Separamos cada parametro
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separamos chaves e valores
            var a = arr[i].split('=');

            // caso os parametros pareçam com: list[]=coisa1&list[]=coisa2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // definimos o valor caso esteja vazio para true (use 'true' if empty)
            var paramValue = typeof a[1] === 'undefined' ? true : a[1];

            // Se o nome do parametro já existir
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
            // Se o nome do parâmetro não existir, defina-o
            else {
                    obj[paramName] = paramValue;
                }
        }
    }

    return obj;
}