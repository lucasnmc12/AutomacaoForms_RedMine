Automação feita para integrar as respostas de um formulário com o RedMine.
As sugestões de ideias são preenchidas em um forms e eram passadas manualmente para o RedMine para serem avaliadas. 
Com essa automação por meio do Googel App Script e utilizando a API do RedMine, as ideias expostas na planilha são classificadas como "Aprovado" ou "Reprovado", e com um clique as ideias aprovadas são passadas para o RedMine.
A API do RedMine retorna os IDs de cada ideia adicionada, evitando que ideias repetidas sejam acrescentadas devido à um "if" que verifica se o campo ID já está preenchido.
![image](https://github.com/user-attachments/assets/cd9da3cb-cbfd-4cf2-8225-31b9f32aedf6)
