<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=header"/>

# 📅 System - Fatec Itu 📅

<p align="left">
<a href="./README.md">
<img src="https://img.shields.io/badge/🌍%20Click%20here%20to%20read%20in%20portuguese!%20-purple?style=for-the-badge" alt="Button to read in Portuguese"/>
</a>
</p>

## ⭐ Front-End Repository

## 📌 About the project

### This system was developed so that events at Fatec Itu - Dom Amaury Castanho could have a more practical registration method, making it easier for students, outsiders, and event organizers. Clearly, this system is also used by event organizers to manage and control events, users, banners, categories, etc.

### 👥 This system is being created by: Guilherme Francisco Pereira and José Lucas Martins Gomes as a final project development / Real system

### ✨ Interesting fact!! This is the only system developed solely by students that is implemented and used by the college, including students, professors, coordinators, and more!

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=footer"/>

##

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&section=header"/>

## 🛎️ Updates to this commit

### `./package.json`: Added to the react-icons library:
> https://github.com/react-icons/react-icons

### `./src/components/Sidebar:` Sidebar menu for the user to switch routes more easily without taking up too much screen space.

### `./src/hooks/components/Sidebar/useSideBar:` Handles the possibility of closing or opening the sidebar menu when clicking the 'X'.

### `./src/components/Header/Header.module.css:` Edited the Header styling so that when the width is less than 480px, it places the Fatec logo in the middle and the sidebar menu in the upper left corner.

### `.src/app/layout.tsx:` Added the Sidebar component as fixed on all pages

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer"/>

## 

## 🖥 Technologies Used
<div align='center'>

!['NextJS'](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
!['TypescriptLogo'](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
!['CssLogo'](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

## Versions used: 
- Next: 15.4.2 
- React: 19.1.0 
- Typescript: 5

## 🙋🏻‍♂ How do I find my way around the project?

### All project source code files are in: `./src`

## 🛈 How the project is structured

- `./public:` Folder containing the static files that Next.js serves directly from the site root, bypassing the build pipeline.
    - `favicon.ico:` Site icon displayed in browser tabs, bookmarks, and on mobile devices.
    - `assets:` Directory within public to organize additional static resources.
        - `images:` Assets subfolder that stores all project images (PNG, JPG, SVG), such as logos, backgrounds, and custom icons.

- `./src/app:` This is a Next project. If you don't have any knowledge of Next, look up "App Router Next" to learn more about the project and its folder and route structure! Within the app, we have:
    - `layout.tsx:` Imports global styles and fonts, sets metadata (such as title and description), and encapsulates the application.
    - `global.css:` Global styling, imported into our layout.tsx to pass throughout the application
    - `(pages):` Contains all of our application routes, but remember, whenever they're inside parent folders, that folder won't be recognized as a route! Our pages:
        - `(public)`:
        - Everything inside this folder is our public route pages, which users can access even without being logged in. Here we have:
            - `page.tsx`: Our first page, also known as our "home" page, is the screen the user sees as soon as they access the site.
        - `(private)`
        - These are our private route pages, where only logged-in users can access!

- `./src/components`: This is where the components that will be reused in various parts of the code are located. In this project, we have the following components:
    - `Buttons:`
        - `ButtonDarkMode:` The button responsible for managing the site's dark mode (light/dark mode).
    - `Header:` Component that remains fixed on all pages because it was inserted within `layout.tsx` and is located at the top of the site

- `./src/hooks:` Here we will store our custom hooks with the logical parts of the application. We separated our hooks by types such as pages, components, and API.
    - `components:`
        - `Buttons`: Logical parts of our button components
            - `useButtonDarkMode:` Responsible for handling dark mode, changing the theme based on the user's click!
        - `Sidebar:`
            - `useSideBar:` Handles the possibility of closing or opening the sidebar menu when clicking the 'X'

## ❔ How to run the project on my machine?

- First of all, you need to have Git installed on your computer. Git is a tool that allows you to clone and manage code repositories.
- Windows: Download Git <a href="https://git-scm.com/download/win" target="_blank">here</a> and follow the installation instructions.
- macOS: You can install Git <a href="https://git-scm.com/download/mac" target="_blank">here</a> or using Homebrew with the brew install git command:
```bash
brew install git
```

- Linux: Use your distribution's package manager, for example, for Debian/Ubuntu:
```bash
sudo apt install git
```

- Open a terminal (on Windows, you can use Git Bash, which is installed along with Git).

- Navigate to the directory where you want to store the project.

- Run the command to clone the repository:

```bash
git clone https://github.com/GuilhermeFranciscoPereira/Eventos_Fatec_Itu-FrontEnd.git
```

- After cloning the repository, navigate to the project folder.
```bash
cd Eventos_Fatec_Itu-FrontEnd
```

- Now you can open the project files with your preferred text editor or IDE. Example:
```bash
code .
```

- 🚨 Don't forget that to avoid errors in the code when cloning it, you must run the command below: 🚨
```bash
npm i
```

- Once you have the project on your machine, open the website. To do this, follow the steps below:
- Open the terminal and write the code below to start the site:
```bash
npm run dev
```

- ⚠️ Remember to create the .env file based on everything contained in the file: `.env.example`

##

## 🎉 That's it! This is Fatec Itu's event system. If you have any questions or would like to discuss anything directly with me, you can contact me through my LinkedIn:
> My LinkedIn link: <a href="https://www.linkedin.com/in/guilherme-francisco-pereira-4a3867283" target="_blank">https://www.linkedin.com/in/guilherme-francisco-pereira-4a3867283</a>

### 🚀 Thank you for your attention and I hope you enjoyed what you saw here. How about checking out my other repositories now? 👋🏻

#

### ❤️ Credits:

#### Primary credits to the Itu Faculty of Technology for lending their name and using the system in their environment! > <a href="https://fatecitu.cps.sp.gov.br" target="_blank">https://fatecitu.cps.sp.gov.br</a>

#### Emoji credits:
> <a href="https://emojipedia.org" target="_blank">https://emojipedia.org</a>

#### Badge credits:
> <a href="https://shields.io" target="_blank">https://shields.io</a>