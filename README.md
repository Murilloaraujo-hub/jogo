# Cinzas do Relógio

Jogo original de plataforma 2D sobre Lume, uma pequena figura mascarada atravessando três regiões para reacender um relógio antigo. Combina combate à distância, exploração lateral e confrontos com chefes. A direção visual mistura silhuetas sombrias, cores quentes e formas desenhadas no próprio Canvas — sem usar personagens, imagens ou áudio de Cuphead ou Hollow Knight.

## O que já está jogável

- **3 fases** com cenários, plataformas, inimigos, obstáculos e fragmentos de cura diferentes.
- **3 chefes** com barras de vida, telegráficos e padrões próprios de ataques.
- **Movimentação e física básica:** aceleração, atrito, gravidade, pulo variável, plataformas, brechas, espinhos, dano e invulnerabilidade temporária.
- **Investida com recarga** e breve janela de invulnerabilidade.
- **Câmera lateral suave** que acompanha Lume e respeita os limites do cenário.
- **Ponto de retorno** por fase; chefes derrotados liberam a fase seguinte.
- **Progresso salvo localmente** no navegador.
- Controles para teclado e **botões de toque** em telas móveis.
- Arte vetorial e efeitos desenhados em Canvas 2D, sem dependências externas.

## Como jogar

| Ação | Teclado |
| --- | --- |
| Mover | `A` / `D` ou `←` / `→` |
| Pular | `Espaço`, `W` ou `↑` |
| Atirar | Segure `J` ou `X` (também funciona com clique esquerdo) |
| Investida | `Shift` ou `K` |
| Pausar / continuar | `Esc` |
| Menu | `M` nas telas de pausa e resultado |
| Reiniciar do marco | `R` nas telas de pausa ou derrota |

No menu, escolha uma fase liberada com as setas ou clicando no cartão e pressione `Enter`.

## Executar localmente

Não é necessário instalar pacotes. Abra `index.html` diretamente ou sirva a pasta com um servidor estático:

```bash
cd cinzas-do-relogio
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Publicar no GitHub Pages

1. Crie um repositório vazio chamado `cinzas-do-relogio` no GitHub.
2. No terminal, dentro desta pasta, conecte e envie a branch local:

   ```bash
   git remote add origin https://github.com/SEU_USUARIO/cinzas-do-relogio.git
   git push -u origin main
   ```

   (Ou envie os arquivos desta pasta pela interface do GitHub.)
3. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`.
4. Salve. O GitHub Pages publicará o jogo usando `index.html` como página inicial.

## Estrutura

```text
index.html   página e canvas do jogo
style.css    tela responsiva e controles de toque
game.js      fases, física, câmera, combate, chefes e desenho procedural
README.md    documentação
LICENSE      licença MIT
```

## Créditos e licença

Código e arte procedural deste protótipo: licença MIT (consulte `LICENSE`). O título, personagens, mundo e ilustrações são criações originais deste projeto.
