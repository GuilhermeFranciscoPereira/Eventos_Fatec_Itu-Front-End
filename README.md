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

### 👥 Este sistema está sendo criado por: Guilherme Francisco Pereira como desenvolvimento de TCC / Sistema real

### ✨ Fato interessante!! Este é o único sistema desenvolvido somente por alunos que está implementado e em uso pela faculdade, tanto por alunos, professores, coordenadores, e etc!

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=footer"/>

##

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&section=header"/>

## 🛎️ Atualizações deste commit

### `./public/assets/images/login:` Pasta que irá armazenar nossas fotos para utilizar nas telas de Login ( Recuperar senha e autenticação em dois fatores )

### `./src/@Types:` Armazena as tipagens que são reutilizadas no código

### `./src/@Types/UserRoleProps.ts:` Tipagem de usuário e suas roles

### `./src/app/(public)/Login:` Tela de login, ao acessar: /Login. Solicita e-mail e senha para o usuário acessar a plataforma, caso o e-mail e senha estejam correto o usuário troca para o stage de 'confirm' onde insere os 6 digitos enviado ao e-mail para acessar ( 2FA )

### `./src/app/(public)/Login/ResetPassword:` Tela para o usuário trocar de senha, ao acessar: /Login/ResetPassword. Solicita primeiro o e-mail, se existir troca para a tela para informar a nova senha, confirmar, e inserir o código de 6 dígitos enviado ao e-mail.

### `./src/components/CodeInputValidation:` Componente reutilizável com 6 caixinhas para o 2fa, tanto para confirmar login quando para resetar a senha

### `./src/hooks/api:` Aqui ocorrem os métodos HTTP fazendo requisições para o back-end

### `./src/hooks/api/auth:` Todas as requisições para o back-end nas rotas de /auth/

### `./src/hooks/api/auth/Get:` Requisições GET nas rotas de /auth/

### `./src/hooks/api/auth/Get/getMe:` Utilizado para pegar com o back-end os dados do usuário, como nome, e-mail, role e etc.

### `./src/hooks/api/auth/Post:` Requisições POST nas rotas de /auth/

### `./src/hooks/api/auth/Post/useLogin:` Requisições para o back-end para fazer a solicitação de login (gerar código 2fa) e confirmar código 2fa para entrar na conta

### `./src/hooks/api/auth/Post/useLogout:` Bate na rota de logout para permitir o usuário a se deslogar 

### `./src/hooks/api/auth/Post/useResetPassword:` Requisições para o back-end para fazer a solicitação de troca de senha (gerar código 2fa) e confirmar código 2fa para trocar a senha

### `./src/hooks/components/CodeInputValidation:` Lida com a parte lógica dos inputs da autenticação em dois fatores

### `./src/hooks/pages:` Lógicas das páginas, arquivos page.tsx que fica dentro de app

### `./src/hooks/pages/(private):` Lógicas das páginas, arquivos page.tsx que fica dentro de app -> (pages/private)

### `./src/hooks/pages/(public):` Lógicas das páginas, arquivos page.tsx que fica dentro de app -> (pages/public)

### `./src/hooks/pages/(public)/Login:` Partes lógicas da rota /Login

### `./src/hooks/pages/(public)/Login/useYeti:` Controla o yeti para lidar com a animação de "interagir" com os inputs

### `./src/stores:` Stores para a biblioteca Zustand

### `./src/stores/User:` Para setar o usuário na aplicação

### `./src/stores/HydratorZustand.ts:` O "Hidrator" do Zustand para usar no layout.tsx de forma direta

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
            - `login:` Pasta que irá armazenar nossas fotos para utilizar nas telas de Login ( Recuperar senha e autenticação em dois fatores )
            - `readme:` Pasta que irá armazenar nossas fotos para utilizar na documentação ( README )

- `./src/@Types:` Armazena as tipagens que são reutilizadas no código`
    - `UserRoleProps.ts:` Tipagem de usuário e suas roles.

- `./src/app:` Este é um projeto Next, caso não possua conhecimento em Next procure sobre "App Router Next" para entender mais sobre o projeto e sua estrutura de pastas e rotas! Dentro do app temos: 
  - `global.css:` Estilizações globais, importado dentro do nosso layout.tsx para passar para toda a aplicação
  - `layout.tsx:` Importa estilos globais e fontes, configura metadados (como título e descrição), e encapsula a aplicação.
    - `loading.tsx:` Este é um componente especial do Next.js para exibir algo em carregamento durante o fetch de dados ou mudança de rota, para mostrar isso ao usuário inserimos o nosso componente Loader.
  - `(pages):` Possui todas nossas rotas da aplicação, mas lembre-se, sempre que estiver dentro de parentes não será reconhecido como rota aquela pasta! Nossa páginas:
    - `(public):` Tudo que está dentro desta pasta são nossas páginas de rota publica, onde mesmo sem estar logado o usuário pode acessar. Nela temos:
        - `page.tsx`: Nossa primeira página, também conhecido como o nosso "home", é a tela em que o usuário visualiza assim que acessa o site.
            - `Login:` Tela de login, ao acessar: /Login. Solicita e-mail e senha para o usuário acessar a plataforma, caso o e-mail e senha estejam correto o usuário troca para o stage de 'confirm' onde insere os 6 digitos enviado ao e-mail para acessar ( 2FA )
                - `ResetPassword:` Tela para o usuário trocar de senha, ao acessar: /Login/ResetPassword. Solicita primeiro o e-mail, se existir troca para a tela para informar a nova senha, confirmar, e inserir o código de 6 dígitos enviado ao e-mail.

    - `(private):` Aqui são nossas páginas de rotas privada, onde somente usuários logados podem acessar!

- `./src/components:` Onde está os componentes que serão reutilizados em diversas partes do código. Neste projeto temos os components:
    - `Buttons:`
        - `ButtonDarkMode:` Botão responsável por cuidar do dark mode do site ( modo claro / escuro ).
        - `ButtonRay:` Botão que é reutilizado em diversas partes do código, alterando o texto e etc com base nas props
    - `CodeInputValidation:` Componente reutilizável com 6 caixinhas para o 2fa, tanto para confirmar login quando para resetar a senha
    - `Header:` Componente que fica fixo em todas as páginas pois foi inserido dentro de `layout.tsx` e fica localizado ao topo superior do site
    - `Inputs:`
        - `InputDefault:` Input reutilizável alterando os dados com base nas props recebidas
    - `Loader:` Componente que mostra ao usuário que algo está carregando
    - `Sidebar:` Menu sidebar para o usuário conseguir trocar de rotas de uma maneira mais acessível sem ocupar tanto espaço de tela

- `./src/hooks:` Armazenaremos aqui os nossos hooks personalizados com as partes lógicas da aplicação, nós separamos os nossos hooks, por tipos como: pages, components e api.
    - `api`:` Aqui ocorrem os métodos HTTP fazendo requisições para o back-end
        - `Auth:` Todas as requisições para o back-end nas rotas de /auth/
        - `Get:` Requisições GET nas rotas de /auth/
            - `getMe:` Utilizado para pegar com o back-end os dados do usuário, como nome, e-mail, role e etc.
        - `Post:` Requisições POST nas rotas de /auth/
            - `useLogin:` Requisições para o back-end para fazer a solicitação de login (gerar código 2fa) e confirmar código 2fa para entrar na conta
            - `useLogout:` Bate na rota de logout para permitir o usuário a se deslogar 
            - `useResetPassword:` Requisições para o back-end para fazer a solicitação de troca de senha (gerar código 2fa) e confirmar código 2fa para trocar a senha
    - `components:`
        - `Buttons`: Partes lógicas dos nossos componentes de botões
            - `useButtonDarkMode:` Responsável por lidar com o dark mode, mudando o tema com base no click do usuário!
        - `Sidebar:`
            - `useSideBar:` Lida com a possibilidade de fechar ou abrir o menu sidebar ao clicar no 'X'
        - `CodeInputValidation:` 
            - `useCodeInputValidation:` Lida com a parte lógica dos inputs da autenticação em dois fatores
    - `pages` Lógicas das páginas, arquivos page.tsx que fica dentro de app
        - `(private):` Lógicas das páginas, arquivos page.tsx que fica dentro de app -> (pages/private)
        - `(public):` Lógicas das páginas, arquivos page.tsx que fica dentro de app -> (pages/public)
            - `(public)/Login:` Partes lógicas da rota /Login
                - `(public)/Login/useYeti:` Controla o yeti para lidar com a animação de "interagir" com os inputs

- `./src/stores:` Stores para a biblioteca Zustand
    - `User:`
        - `userStore.ts:` Para setar o usuário na aplicação
    - `HydratorZustand.ts:` O "Hidrator" do Zustand para usar no layout.tsx de forma direta

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
    git clone https://github.com/GuilhermeFranciscoPereira/Eventos_Fatec_Itu-Front-End.git
    ```

- Após clonar o repositório, navegue até a pasta do projeto
    ```bash
    cd Eventos_Fatec_Itu-Front-End
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

## ⚠️ Informações importantes sobre o projeto ⚠️

### 📝 Todos os commits do projeto possuem um readme detalhado do que foi feito naquele commit como mostrado de exemplo na imagem abaixo, então caso deseje ver o processo de criação do código viaje pelos commits e veja as informações!

## 
![Exemplo de como é o processo da criação do projeto no readme](./public/assets/images/readme/example_howToReadTheCommits.png)
##

### ❔ Como fazer isso? 

### 👇🏻 Para você ver o processo de criação e o que foi feito em cada commit siga o passo-a-passo:

##

### 1 - Nesta mesma guia em que você está, suba a tela até encontrar embaixo do botão verde o local em que está circulado da foto abaixo e então clique nele
![1 passo - Como ver o processo da criação do projeto](./public/assets/images/readme/firstStep_howToReadTheCommits.png)

##

### 2 - No lado direito dos commits você encontra um simbolo de <> como está circulado na foto abaixo e então você clica neste simbolo e irá encontrar como o código estava naquele momento e o readme detalhado daquele momento!
![2 passo - Como ver o processo da criação do projeto](./public/assets/images/readme/secondStep_howToReadTheCommits.png)

##

### 3 - Depois de encontrar tudo que deseja, caso queira voltar o commit atual, você irá clicar no local em que a imagem a baixo circula:
![3 passo - Como ver o processo da criação do projeto](./public/assets/images/readme/thirdStep_howToReadTheCommits.png)

##

### 4 - E então clique em main ( onde está circulado na foto abaixo ) e voltará para o último commit realizado!
![4 passo - Como ver o processo da criação do projeto](./public/assets/images/readme/fourthStep_howToReadTheCommits.png)

##

## 🎉 É isso! Esse é o sistema da Fatec Itu para eventos, caso tenha ficado com alguma dúvida ou deseje complementar algo diretamente comigo você pode estar entrando em contato através do meu LinkedIn:
> Link do meu LinkedIn: <a href="https://www.linkedin.com/in/guilherme-francisco-pereira-4a3867283" target="_blank">https://www.linkedin.com/in/guilherme-francisco-pereira-4a3867283</a>

### 🚀 Obrigado pela atenção e espero que tenha gostado do que tenha visto aqui, que tal agora dar uma olhada nos meus outros repositórios? 👋🏻

#

### ❤️ Créditos:

#### Créditos primários à Faculdade de Tecnologia de Itu por ceder seu nome, e utilizar o sistema em seu ambiente!
> <a href="https://fatecitu.cps.sp.gov.br" target="_blank">https://fatecitu.cps.sp.gov.br</a>

#### Créditos dos emojis: 
> <a href="https://emojipedia.org" target="_blank">https://emojipedia.org</a>

#### Créditos dos badges: 
> <a href="https://shields.io" target="_blank">https://shields.io</a>