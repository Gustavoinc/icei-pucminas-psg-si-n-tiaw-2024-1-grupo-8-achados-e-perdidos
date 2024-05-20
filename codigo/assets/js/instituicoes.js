/* Arquivo de Javascript da página de cadastro de um item */
import {putJSON, getJSON} from "./modules/json.js";

var link_preenchido = false;
var link_img = null;

const caminho_JSON = "https://7632dd34-2094-462f-97e8-638cefefbbfe-00-xy9ocks2w8wk.riker.replit.dev/";

/* ----------- Funções inicio ----------- */
function preenche_select(id, nome, select) {
    let text = `<option value="${id}">${nome}</option>`;
    select.innerHTML += text;
}



function cadastra_instituicao(intituicoes) {
    // Procura a instituição
    let id_instituicao = document.getElementById("select_instituicao").value;
    let instituicao = encontra_instituicao(id_instituicao, intituicoes);

    // To-do: alerta cadastro errado
    if(instituicao === null) {

    } else {
        // Variaveis que serão utilizadas
        let nome = document.getElementById("nome_instituicao").value;
        let endereco = document.getElementById("end_insti").value;

        // Aumenta a quantidade de instituição (para o registro do id)
        let meta_req = new XMLHttpRequest();
        meta_req.open("GET", caminho_JSON + "meta/");
        meta_req.send();

        meta_req.onload = function () {
            let meta = JSON.parse(meta_req.response);
            meta.qnt_insti++;

            // Cria o novo objeto de item
            let novo_item = {
                id: meta.qnt_item,
         
                nome: `${nome}`,
                endereco: `${endereco}`,
                link_img: link_img,
            }

            try{
                // Escreve no arquivo json
                putJSON(caminho_JSON + `instituicoes/${id_instituicao}`, JSON.stringify(instituicao))
                // escreve no arquivo meta
                putJSON(caminho_JSON + "meta", JSON.stringify(meta))
            }catch(e){
                console.log('Erro ao salvar novo item')
            }
        }
    }
}
/* ----------- Funções fim ----------- */

function main() {
    // Declara variaveis
    var form_cadastro = document.getElementById("cadastro_insti");
    var lista_input = document.getElementsByClassName("instituicao_input");
    var div_img = document.getElementsByClassName("form_upload_img")[0];
    var requisicao = new XMLHttpRequest();

    // Esse trecho de código implementa a função do input de imagem 
    div_img.addEventListener("click", () => {
        link_img = prompt("Digite o link da imagem:");
        if(link_img !== null) {
            var img = new Image();
            
            // Para saber se o link é válido
            img.src = link_img;
            img.onload = function() {
                div_img.innerHTML = `<img src="${link_img}" id="img_uploaded" alt="Imagem não carregou">`;
                document.getElementById("img_uploaded").src = link_img;
                link_preenchido = true;
            };
            img.onerror = function() {
                alert("Link incorreto");
                link_preenchido = false;
            };
        }
    });

    // Leitura dos dados do json
    requisicao.open("GET", caminho_JSON + "instituicoes");
    requisicao.responseType = "json";
    requisicao.send();

    requisicao.onload = function () {
        let resposta_requisicao = requisicao.response;

        // Preenche o select de instituições
        let select_instituicao = document.getElementById("select_instituicao");
        resposta_requisicao.forEach(element => {
            preenche_select(element.id, element.nome, select_instituicao);
        });

        
        form_cadastro.addEventListener("submit", (event) => {
            event.preventDefault();
            if(link_preenchido) {
                cadastra_item(resposta_requisicao);
            } else {
                alert("O link da imagem está vazio ou não é valido");
            }
        });
    };
}

main();