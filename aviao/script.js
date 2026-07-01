// === CLASSES DE NEGÓCIO ===
class Voo {
    constructor(codigo, destino) {
        this.codigo = codigo;
        this.destino = destino;
    }
}

class RadarService {
    async buscarVoosGlobais() {
        console.log("Iniciando busca no satélite...");
        
        // Simulação de API Real (JSONPlaceholder)
        let resposta = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        
        if (!resposta.ok) {
            throw new Error("Falha na resposta do satélite.");
        }
        
        let dadosJson = await resposta.json();
        return dadosJson.map(dado => new Voo(dado.id, `Destino Internacional #${dado.id}`));
    }
}

// === CONTROLADOR DE INTERFACE (UX) ===
async function inicializarPainel() {
    // Simulando dois elementos na tela: o indicador de carregamento e o painel de voos
    let loadingDOM = document.getElementById("loadingIndicador") || { style: {} };
    let painelDOM = document.getElementById("telaPainel") || { innerHTML: "" };
    
    let radar = new RadarService();

    // 1. ESTADO DE LOADING: Ativa o aviso antes de ir para a internet
    loadingDOM.innerHTML = "Buscando dados no satélite... 📡";
    loadingDOM.style.display = "block"; 

    try {
        // O 'await' obriga o código a esperar a resposta do satélite aqui
        let listaPronta = await radar.buscarVoosGlobais();
        
        // 2. ESTADO DE SUCESSO: Renderiza os voos na tela
        let linhas = listaPronta.map(v => `<li>Código: ${v.codigo} | Rota: ${v.destino}</li>`).join("");
        painelDOM.innerHTML = `<h3>Sucesso! Temos ${listaPronta.length} voos no radar:</h3><ul>${linhas}</ul>`;

    } catch (erro) {
        // 3. ESTADO DE ERRO: Alerta o usuário se a internet cair ou a URL quebrar
        painelDOM.innerHTML = "<b style='color: red;'>Falha de Conexão com o Satélite! ❌</b>";

    } finally {
        // O GRANDE TRUQUE DE UX: O finally roda por último, SEMPRE.
        // Ele esconde o Loading, mas NÃO APAGA o sucesso ou o erro que foram colocados no painelDOM!
        loadingDOM.innerHTML = "";
        loadingDOM.style.display = "none";
        console.log("Carregamento encerrado de forma segura.");
    }
}

// Executa o sistema
inicializarPainel();