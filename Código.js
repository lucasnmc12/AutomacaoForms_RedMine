function enviarIdeiasParaRedmine() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Respostas ao formulário 1");

  if (!sheet) {
    Browser.msgBox("Erro: A aba 'Respostas ao formulário 1' não foi encontrada.");
    Logger.log("Erro: A aba 'Respostas ao formulário 1' não foi encontrada.");
    return;
  }

  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) { // Apenas cabeçalhos sem dados
    Browser.msgBox("A aba está vazia!");
    Logger.log("A aba está vazia!");
    return;
  }

  // Configurações do Redmine
  var REDMINE_URL = "https://redmine.multimarcasconsorcios.com.br/projects/teste-api"; 
  var API_KEY = "API KEY"; 
  var PROJECT_ID = 22; 

  // Índices das colunas na planilha 
  var nomeIndex = 1;  // Coluna B - Nome Completo
  var cargoIndex = 2; // Coluna C - Cargo
  var departamentoIndex = 3; // Coluna D - Departamento
  var emailIndex = 4; // Coluna E - E-mail
  var telefoneIndex = 5; // Coluna F - Telefone
  var tituloIndex = 6; // Coluna G - Título da Ideia
  var descricaoIndex = 7; // Coluna H - Descrição da Ideia
  var problemaIndex = 8; // Coluna I - Qual problema sua ideia resolve?
  var publicoIndex = 9; // Coluna J - Qual o público ou setor beneficiado?
  var necessidadeIndex = 10; // Coluna K - Como atende às necessidades da empresa?
  var beneficioIndex = 11; // Coluna L - Quais os benefícios esperados?
  var statusIndex = 12; // Coluna M - Status (Aprovado/Reprovado)
  var idTarefaIndex = 13; // Coluna N - ID da Tarefa no Redmine (Nova coluna)

  var mensagensEnviadas = 0;

  for (var i = 1; i < data.length; i++) { // Começa na linha 2 (ignora cabeçalhos)
    var nome = data[i][nomeIndex];
    var cargo = data[i][cargoIndex];
    var departamento = data[i][departamentoIndex];
    var email = data[i][emailIndex];
    var telefone = data[i][telefoneIndex];
    var titulo = data[i][tituloIndex];
    var descricao = data[i][descricaoIndex];
    var problema = data[i][problemaIndex];
    var publico = data[i][publicoIndex];
    var necessidade = data[i][necessidadeIndex];
    var beneficio = data[i][beneficioIndex];
    var status = data[i][statusIndex]; // Caso tenha uma coluna de aprovação
    var idTarefa = data[i][idTarefaIndex]; // ID da tarefa no Redmine

    // Se já existe um ID de tarefa, pular o envio
    if (idTarefa && idTarefa !== "") {
      Logger.log(`Ideia já enviada anteriormente (ID: ${idTarefa}) - ${titulo}`);
      continue;
    }

    // Se houver uma coluna de status, só enviar as ideias aprovadas
    if (statusIndex && status !== "Aprovado") {
      Logger.log(`Ideia ignorada (não aprovada): ${titulo}`);
      continue;
    }

    var payload = {
      issue: {
        project_id: PROJECT_ID,
        subject: titulo,
        description: `**Nome Completo:** ${nome}\n` +
                     `**Cargo:** ${cargo}\n` +
                     `**Departamento:** ${departamento}\n` +
                     `**E-mail:** ${email}\n` +
                     `**Telefone:** ${telefone}\n\n` +
                     `**Descrição da Ideia:**\n${descricao}\n\n` +
                     `**Qual problema sua ideia resolve?**\n${problema}\n\n` +
                     `**Qual o público ou setor beneficiado?**\n${publico}\n\n` +
                     `**Como atende às necessidades da empresa?**\n${necessidade}\n\n` +
                     `**Quais os benefícios esperados?**\n${beneficio}\n`,
        tracker_id: 1, // Tipo de tarefa (Feature, Bug, etc.)
        status_id: 1 // Status inicial da ideia no Redmine
      }
    };

    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "X-Redmine-API-Key": API_KEY
      },
      payload: JSON.stringify(payload)
    };

    try {
      var response = UrlFetchApp.fetch(REDMINE_URL + "/issues.json", options);
      var jsonResponse = JSON.parse(response.getContentText());
      var taskId = jsonResponse.issue.id; // Captura o ID gerado pelo Redmine

      Logger.log(`Enviado para Redmine (ID: ${taskId}) - ${titulo}`);

      // Atualiza a planilha com o ID da tarefa criada
      sheet.getRange(i + 1, idTarefaIndex + 1).setValue(taskId);

      mensagensEnviadas++;
    } catch (e) {
      Logger.log("Erro ao enviar a ideia para o Redmine: " + e.toString());
    }
  }

  if (mensagensEnviadas > 0) {
    Browser.msgBox(`${mensagensEnviadas} ideias aprovadas enviadas para o Redmine!`);
  } else {
    Browser.msgBox("Nenhuma ideia nova foi encontrada para envio.");
  }
}

