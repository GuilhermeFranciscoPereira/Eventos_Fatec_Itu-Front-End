<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=header"/>

# 📅 Sistema - Fatec Itu 📅

<p align="left">
  <a href="./README.en.md">
    <img src="https://img.shields.io/badge/🌍%20Click%20here%20to%20read%20in%20english!%20-purple?style=for-the-badge" alt="Botão para ler em inglês"/>
  </a>
</p>

## ⭐ Repositório Front-End

## 📌 Sobre o projeto

### Este sistema foi desenvolvido para que os eventos da Faculdade Fatec Itu - Dom Amaury Castanho pudessem ter um método de inscrição mais práticos, gerando facilidade tanto para os alunos, pessoas de fora e para os responsáveis pelos eventos. Claramente este sistema também é utilizado pelos responsáveis dos eventos, para gerenciamento e controle de eventos, usuários, banners, categorias e etc. 

### 👥 Este sistema está sendo criado por: Guilherme Francisco Pereira e José Lucas Martins Gomes como desenvolvimento de TCC / Sistema real

### ✨ Fato interessante!! Este é o único sistema desenvolvido somente por alunos que está implementado e em uso pela faculdade, tanto por alunos, professores, coordenadores, e etc!

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=footer"/>

##

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&section=header"/>

## 🛎️ Atualizações deste commit

### `./package.json`: Adicionado à biblioteca do react-icons:
> https://github.com/react-icons/react-icons

### `./src/components/Sidebar:` Menu sidebar para o usuário conseguir trocar de rotas de uma maneira mais acessível sem ocupar tanto espaço de tela

### `./src/hooks/components/Sidebar/useSideBar:` Lida com a possibilidade de fechar ou abrir o menu sidebar ao clicar no 'X'

### `./src/components/Header/Header.module.css:` Editado a estilização do Header para que quando o width for menor que 480px ele coloque a logo da Fatec no meio e o menu do sidebar no canto superior esquerdo'

### `.src/app/layout.tsx:` Adicionado o componente Sidebar como fixo em todas as páginas

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer"/>

##

## 🖥 Tecnologias Utilizadas
<div align='center'>

!['NextJS'](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
!['TypescriptLogo'](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
!['CssLogo'](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

## Versões utilizadas:
    - Next: 15.4.2
    - React: 19.1.0
    - Typescript: 5

## 🙋🏻‍♂ Como me localizar no projeto?

### Todos os arquivos de código fonte do projeto estão em: `./src`

## 🛈 Como o projeto está estruturado

- `./public:` Pasta que contém os arquivos estáticos que o Next.js serve diretamente da raiz do site, sem passar pelo pipeline de build.
    - `favicon.ico:` ícone do site exibido na aba do navegador, nos favoritos e em dispositivos móveis.
    - `assets:` diretório dentro de public para organizar recursos estáticos adicionais.
        - `images:` subpasta de assets que armazena todas as imagens do projeto (PNG, JPG, SVG), como logos, backgrounds e ícones personalizados.

- `./src/app:` Este é um projeto Next, caso não possua conhecimento em Next procure sobre "App Router Next" para entender mais sobre o projeto e sua estrutura de pastas e rotas! Dentro do app temos: 
  - `layout.tsx:` Importa estilos globais e fontes, configura metadados (como título e descrição), e encapsula a aplicação.
  - `global.css:` Estilizações globais, importado dentro do nosso layout.tsx para passar para toda a aplicação
  - `(pages):` Possui todas nossas rotas da aplicação, mas lembre-se, sempre que estiver dentro de parentes não será reconhecido como rota aquela pasta! Nossa páginas:
    - `(public)`:
        - Tudo que está dentro desta pasta são nossas páginas de rota publica, onde mesmo sem estar logado o usuário pode acessar. Nela temos:
        - `page.tsx`: Nossa primeira página, também conhecido como o nosso "home", é a tela em que o usuário visualiza assim que acessa o site.
    - `(private)`
        - Aqui são nossas páginas de rotas privada, onde somente usuários logados podem acessar!

- `./src/components:` Onde está os componentes que serão reutilizados em diversas partes do código. Neste projeto temos os components:
    - `Buttons:`
        - `ButtonDarkMode`: Botão responsável por cuidar do dark mode do site ( modo claro / escuro ).
    - `Header:` Componente que fica fixo em todas as páginas pois foi inserido dentro de `layout.tsx` e fica localizado ao topo superior do site
    - `Sidebar:` Menu sidebar para o usuário conseguir trocar de rotas de uma maneira mais acessível sem ocupar tanto espaço de tela

- `./src/hooks:` Armazenaremos aqui os nossos hooks personalizados com as partes lógicas da aplicação, nós separamos os nossos hooks, por tipos como: pages, components e api.
    - `components:`
        - `Buttons`: Partes lógicas dos nossos componentes de botões
            - `useButtonDarkMode:` Responsável por lidar com o dark mode, mudando o tema com base no click do usuário!
        - `Sidebar:`
            - `useSideBar:` Lida com a possibilidade de fechar ou abrir o menu sidebar ao clicar no 'X'
    
## ❔ Como rodar o projeto na minha máquina?

- Antes de tudo, você precisa ter o Git instalado no seu computador. O Git é uma ferramenta que permite clonar e gerenciar repositórios de código.
    - Windows: Baixe o Git <a href="https://git-scm.com/download/win" target="_blank">aqui</a> e siga as instruções de instalação.
    - macOS: Você pode instalar o Git <a href="https://git-scm.com/download/mac" target="_blank">aqui</a> ou usando o Homebrew com o comando brew install git:
        ```bash
        brew install git
        ```
        
    - Linux: Use o gerenciador de pacotes da sua distribuição, por exemplo para Debian/Ubuntu:
        ```bash
        sudo apt install git
        ```
        

- Abra o terminal (no Windows, você pode usar o Git Bash, que é instalado junto com o Git).

- Navegue até o diretório onde deseja armazenar o projeto.

- Execute o comando para clonar o repositório:

    ```bash
    git clone https://github.com/GuilhermeFranciscoPereira/Eventos_Fatec_Itu-FrontEnd.git
    ```

- Após clonar o repositório, navegue até a pasta do projeto
    ```bash
    cd Eventos_Fatec_Itu-FrontEnd
    ```

- Agora você pode abrir os arquivos do projeto com seu editor de texto ou IDE preferido. Exemplo do vsCode: 
    ```bash
    code .
    ```

- 🚨 Não esqueça que para não ocorrer erros no código ao clonar ele, você deve fazer o comando abaixo 🚨
    ```bash
    npm i   
    ```

- Ao ter o projeto na sua máquina você deve abrir o site. Para isso siga os passos abaixo:
    - Abra o terminal e escreva o código abaixo para iniciar o site:
      ```bash
      npm run dev
      ```

    - ⚠️ Lembre-se de criar o arquivo .env com base em tudo que contem no arquivo: `.env.example`

##

## 🎉 É isso! Esse é o sistema da Fatec Itu para eventos, caso tenha ficado com alguma dúvida ou deseje complementar algo diretamente comigo você pode estar entrando em contato através do meu LinkedIn:
> Link do meu LinkedIn: <a href="https://www.linkedin.com/in/guilherme-francisco-pereira-4a3867283" target="_blank">https://www.linkedin.com/in/guilherme-francisco-pereira-4a3867283</a>

### 🚀 Obrigado pela atenção e espero que tenha gostado do que tenha visto aqui, que tal agora dar uma olhada nos meus outros repositórios? 👋🏻

#

### ❤️ Créditos:

#### Créditos primários à Faculdade de Tecnlogia de Itu por ceder seu nome, e utilizar o sistema em seu ambiente!
> <a href="https://fatecitu.cps.sp.gov.br" target="_blank">https://fatecitu.cps.sp.gov.br</a>

#### Créditos dos emojis: 
> <a href="https://emojipedia.org" target="_blank">https://emojipedia.org</a>

#### Créditos dos badges: 
> <a href="https://shields.io" target="_blank">https://shields.io</a>