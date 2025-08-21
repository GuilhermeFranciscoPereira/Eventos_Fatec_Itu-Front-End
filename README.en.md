<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=header"/>

# 📅 System - Fatec Itu 📅

<p align="left">
<a href="./README.md">
<img src="https://img.shields.io/badge/🌍%20Click%20here%20to%20read%20in%20portuguese!%20-purple?style=for-the-badge" alt="Button to read in Portuguese"/>
</a>
</p>

## ⭐ Front-End Repository

## 📌 About the project

### This system was developed so that events at Fatec Itu - Dom Amaury Castanho could have a more practical registration method, making it easier for students, outsiders, and event organizers. Clearly, this system is also used by event organizers to manage and control events, users, carousel, categories, etc.

### 👥 This system is being created by: Guilherme Francisco Pereira as a final project development / Real system

### ✨ Interesting fact!! This is the only system developed solely by student that is implemented and used by the college, including students, professors, coordinators, and more!

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=footer"/>

##

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&section=header"/>

## 🛎️ Updates to this commit

### `./src/components/Buttons/ButtonComebackUrl:` This button provides the user with the option to return to the previous page or to a URL chosen in the code. If the code does not pass the props to it, by default it returns to the URL previous to the one it is currently on. If you do not pass the label, it comes by default as: "Voltar"

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
    - `favicon.ico:` Site icon displayed in the browser tab, bookmarks, and on mobile devices.
    - `assets:` Directory within public to organize additional static resources.
    - `images:` Assets subfolder that stores all project images (PNG, JPG, SVG), such as logos, backgrounds, and custom icons.
        - `footer:` Folder that will store our photos to use in the Footer component
        - `login:` Folder that will store our photos for use on the login screens (Recover password and two-factor authentication)
        - `readme:` Folder that will store our photos for use in the documentation (README)

- `./src/middleware.ts:` Edge middleware file that authenticates users via JWT cookie, validates token expiration and, based on environment variables, redirects those who are not authenticated to public routes or those who are already authenticated to private routes, preventing unauthorized access.`

- `./src/@Types:` Stores the typings that are reused in the code.
    - `CarouselTypes:` Shared typings from the Carousel screen.
    - `CategoriesTypes:` Shared typings from the Categories screen.
    - `EventTypes:` Shared typings from the Events screen.
    - `ParticipantsTypes:` Shared typings from the Participants screen.
    - `UsersTypes:` Shared typings from the Users screen.
    - `UserJwtProps.ts:` User typings and their roles.

- `./src/app:` This is a Next project. If you don't have any knowledge of Next, look up "App Router Next" to learn more about the project and its folder and route structure! Within the app, we have:
    - `global.css:` Global styles, imported within our layout.tsx to be passed throughout the application.
    - `layout.tsx:` Imports global styles and fonts, sets metadata (such as title and description), and encapsulates the application.
    - `loading.tsx:` This is a special Next.js component to display something loading during data fetch or route changes. To display this to the user, we insert our Loader component.
- `(pages):` Contains all of our application routes, but remember, whenever they are within parent folders, that folder will not be recognized as a route! Our pages:
    - `(private):` Everything inside this folder is our private route pages, which the user must be logged in to access. It contains:
        - `Carousel`: Carousel management screen, control the active photos in the carousel, title, order in which each photo will appear in the carousel, add a new photo, delete a photo, and edit photos, all this integrating with the API hooks in: ./src/hooks/api/Carousel
        - `Categories:` Category management screen, responsible for displaying the list of registered categories and offering the actions to create, edit or delete each category, integrating with the API hooks at: ./src/hooks/api/Categories/
        - `Events:` Event management screen, responsible for displaying the list of registered events and offering the actions to create, edit or delete each event, integrating with the API hooks at: ./src/hooks/api/Events/
            - `Participants:` Page that shows who are the participants of the desired event, showing the name, email, RA, registration date and option to mark attendance.
        - `Users:` User management screen, responsible for displaying the list of registered users and offering the actions to create, edit, or delete each user, integrating with the API hooks at: ./src/hooks/api/Users/
    - `(public):` Everything inside this folder is our public route pages, which the user can access even without being logged in. Here we have:
        - `page.tsx`: Our first page, also known as our "home" page, is the screen the user sees as soon as they access the site.
        - `EventDetail:` Screen to show the event in more detail to unauthenticated users, also allowing them to register for the event
        - `Login:` Login screen, when accessing: /Login. Requests email and password for the user to access the platform. If the email and password are correct, the user moves to the 'confirm' stage where they enter the 6-digit code sent to their email to access (2FA).
            - `ResetPassword:` Screen for the user to change their password, when accessing: /Login/ResetPassword. First, it requests email. If available, it moves to the screen to enter the new password, confirm, and enter the 6-digit code sent to the email.

    - `(private):` These are our private route pages, where only logged-in users can access!

- `./src/components:` Where the components that will be reused in various parts of the code are located. In this project, we have the following components:
    - `Buttons:`
        - `ButtonComebackUrl:` This button provides the user with the option to return to the previous page or to a URL chosen in the code. If the code does not pass the props to it, by default it returns to the URL previous to the one it is currently on. If you do not pass the label, it comes by default as: "Voltar"
        - `ButtonDarkMode:` Button responsible for managing the website's dark mode (light/dark mode). - `ButtonRay:` Button that is reused in various parts of the code, changing the text, etc., based on props.
        - `Button Ray:` Button that is used in different parts of the code, changing the text and etc based on the props
    - `CardEvents:` Cards that show events to unauthenticated users, they only show events that have not yet occurred, they contain brief information such as the photo, title, day and time and speaker.
    - `CarouselComponent:` Carousel component that appears on the home screen displaying images chosen by administrators/coordinators.
    - `CodeInputValidation:` Reusable component with 6 boxes for 2FA, both to confirm login and to reset the password.
    - `Filters:` Combinable filters for events, filters to filter by event name, by categories and by dates based on start and end, this filter component is used in CardEvents
    - `Footer:` Footer that contains information such as: Address, telephone number, links to student areas
    - `Header:` Component that remains fixed on all pages because it was inserted within `layout.tsx` and is located at the top of the site.
    - `ImageCloudinary:` Responsible for rendering images hosted on Cloudinary in an optimized way with the next Image tag, making a component that can be reused anywhere, making the image stay 100% within the parent element correctly
    - `Inputs:`
        - `InputCheckbox:` Checkbox input that is reusable in code for boolean fields
        - `InputDefault:` Reusable input that changes data based on received props.
        - `InputImage:` Allows you to select images by click, drag and drop, or paste. Displays a local or existing URL preview, visually indicates when a file is dragged, and provides a button to remove the image, enabled only when a file is selected.
    - `Loader:` Component that shows the user that something is loading.
    - `Modal:` This is like a "window" overlaid on top of the main interface that blocks interaction with background content until closed or confirmed. It's used to display critical information or specific action requests.
    - `Sidebar:` Sidebar menu so the user can switch routes in a more accessible way without taking up too much screen space.
    - `Table:` Reusable table, you just need to pass the columns, the data, and the hidden columns on mobile.
    - `Toast:` Displays brief notifications. Can be reused in different scenarios by changing only the message and type props (Success, Alert, Error).

- `./src/hooks:` Here we will store our custom hooks with the logical parts of the application. We separate our hooks by types such as pages, components, and api. 
    - `api:` Here, HTTP methods make requests to the backend.
        - `Auth:` All requests to the backend on /auth/ routes.
            - `Get:` GET requests on /auth/ routes.
                - `getMe:` Used to retrieve user data from the backend, such as name, email, role, etc. 
            - `Post:` POST requests in the /auth/ routes
                - `useLogin:` Requests to the backend to make the login request (generate 2FA code) and confirm the 2FA code to access the account
                - `useLogout:` Calls the logout route to allow the user to log out
                - `useResetPassword:` Requests to the backend to make the password change request (generate 2FA code) and confirm the 2FA code to change the password

        - `Carousel:` All requests to the backend on the /carousel/ routes
            - `Delete:` DELETE requests on the /carousel/delete/:id routes
            - `useDeleteCarousel.ts:` Hook that encapsulates the logic for removing a slide, sending DELETE requests with CSRF protection and handling failures to display error messages.
            - `Get:` GET requests on the /carousel routes
            - `useGetAllCarousels.ts:` Hook responsible for loading all slides, managing "loading" and "error" states, and exposing a refetch() function to reload data after mutation operations.
            - `Post:` POST requests on the /carousel/create routes
            - `useCreateCarousel.ts:` Hook that builds a FormData with title, order, status, and image, makes the POST call with CSRF protection, and triggers success or failure toasts. - `Patch:` PATCH requests on /carousel/patch/:id routes
            - `useEditCarousel.ts:` Hook for fully updating a slide (name, order, active, image), switching between multipart/form-data and JSON depending on the presence of a file and including CSRF and exception handling.
            - `useToggleActiveCarousel.ts:` Here, the /carousel/patch/toggle/ route is a hook dedicated to inverting only the isActive field via JSON PATCH with CSRF, displaying a toast indicating "enabled" or "disabled."

        - `Categories:` All requests to the backend on the /categories/ routes
            - `Delete:` DELETE requests on /categories/ routes
                - `useDeleteCategory.ts:` Hook that encapsulates the HTTP request logic to delete a specific category, sending a CSRF-protected DELETE request and ensuring error handling to report deletion failures.
            - `Get:` GET requests on /categories/ routes
                - `useGetAllCategories.ts:` Hook that retrieves the entire list of categories via GET request, managing loading and error states, and allowing refetch after CRUD operations.
            - `Patch:` PATCH requests on /categories/patch/:id routes
                - `useEditCategory.ts:` Hook responsible for sending partial data updates for an existing category via a PATCH request with CSRF, allowing modification of only the category name. 
            - `Post:` POST requests on /categories/ routes
                - `useCreateCategory.ts:` Hook to create a new category in the system via POST request, constructing the payload typed with the category name and including CSRF protection to ensure the security of the operation.

        - `Events:` All requests to the backend on /events/ routes
            - `Delete:` DELETE requests on /event/delete/:id routes
            - `useDeleteEvent.ts:` Hook that encapsulates the logic for deleting an event, sending DELETE requests with CSRF protection and handling failures to display error messages.
            - `Get:` GET requests on /event routes
            - `useGetAllevents.ts:` Responsible for loading all events.
            - `useGetAvailabilityDates.ts:` Responsible for retrieving from the database all days that have at least one available time slot at the location chosen for the event, avoiding having two events at the same location. - `useGetAvailabilityTimes.ts:` Responsible for retrieving all available times from the database to prevent one event from overlapping another on the same day, time, and location.
            - `Patch:` PATCH requests on the /event/patch/:id routes
            - `useEditEvent.ts:` Hook for editing an entire event, allowing for overriding values.
            - `Post:` POST requests on the /event/create routes
            - `useCreateEvent.ts:` Responsible for creating a new event, making the request to the backend and passing the correct values

        - `Participants:` All requests to the backend on the /participants/ routes
            - `Get:` GET requests on the /participants/ routes
                - `useGetAllParticipants:` Returns all participants of a given event based on the event ID provided via props
            - `Patch:` PATCH requests on the /participants/patch/:id routes
                - `useEditParticipants:` Updates the isPresent (boolean) field of the Participant table based on the event ID and, within that event, the participant ID, updating as the user updates the checkbox on the front end.
            - `Post:` POST requests on the /participants/create routes
                - `useCreateParticipant:` Responsible for adding a new person to a specific event, making the request to the backend.

        - `Users` All requests to the backend on the /users/ routes
            - `Delete:` DELETE requests on /users/ routes
                - `useDeleteUser.ts:` Hook that encapsulates the HTTP request logic to delete a specific user, sending a CSRF-protected DELETE request and ensuring error handling to report deletion failures.
            - `Get:` GET requests on /users/ routes
                - `useGetAllUsers.ts:` Hook that retrieves the entire user list via GET request, managing loading and error states, and automatically updating the route if the user is not authorized.
            - `Patch:` PATCH requests on /users/ routes
                - `useEditPersonalProfile:` Hook that allows you to change your profile name and photo.
                - `useEditUser.ts:` Hook responsible for sending partial updates to an existing user's data via a PATCH request with CSRF, allowing modification of name, email, password, or access level.
            - `Post:` POST requests on /users/ routes
                - `useCreateUser.ts:` Hook to create a new user in the system via POST request, building the payload typed with name, email, password, and position, and including CSRF protection to ensure the security of the operation.
    
    - `components:`
        - `Buttons`: Logical parts of our button components
            - `useButtonDarkMode:` Responsible for handling dark mode, changing the theme based on the user's click! 
        - `CarouselComponent:`
            - `useCarouselComponent:` Logical part of the carousel, handles automatic or manual image scrolling, clicking on the balls centered at the bottom, etc.
        - `CodeInputValidation:`
            - `useCodeInputValidation:` Handles the logical part of two-factor authentication inputs
        - `Sidebar:`
            - `useSideBar:` Handles the ability to close or open the sidebar menu when clicking the 'X'
    - `pages` Page logic, page.tsx files located within the app
        - `(private):` Page logic, page.tsx files located within the app -> (pages/private)
            - `/Events:` Logical parts of the /Events route
                - `/useEventForm:` All logical parts of the event creation or editing screen
        - `(public):` Page logic, page.tsx files located within the app -> (pages/public)
            - `(public)/Login:` Logical parts of the /Login route
                - `(public)/Login/useYeti:` Controls the Yeti to handle the animation of "interacting" with inputs

- `./src/stores:` Stores for the Zustand library
    - `ZustandWrapper:` Brings together all Zustand components to share in a single form for the layout.tsx
    - `useModalStore:`
        - `index.ts:` Controls the display and clears the application's modal data.
    - `useToastStore:`
        - `index.ts:` Responsible for orchestrating the display, progress animation, and automatic closing of toasts throughout the application.
    - `useUserStore:`
        - `index.ts:` To set the user in the application

- `./src/utils:` Folder that groups generic utility functions, without dependence on specific components, used throughout the application for common DOM and export operations.
    - `downloadSectionAsPdf.ts:` Function that captures a section of the page (identified by ID) and generates a PDF file with its full extension, including A4 page breaks. This allows the user to download any part of the interface as a portable document.
    - `printSection.ts:` Function that clones and prepares a section of the page (identified by ID) for printing, centering it and applying margins, while maintaining the exact colors of the table header. This function triggers the browser's print dialog and prints only the desired content.

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
    git clone https://github.com/GuilhermeFranciscoPereira/Eventos_Fatec_Itu-Front-End.git
    ```

- After cloning the repository, navigate to the project folder.
    ```bash
    cd Eventos_Fatec_Itu-Front-End
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

## ⚠️ Important information about the project ⚠️

### 📝 All project commits have a detailed readme detailing what was done in that commit, as shown in the example image below. So if you want to see the code creation process, scroll through the commits and see the information!

##
![Example of the project creation process in the readme](./public/assets/images/readme/example_howToReadTheCommits.png)
##

### ❔ How to do this?

### 👇🏻 To see the creation process and what was done in each commit, follow these steps:

##

### 1 - In this same tab you're in, scroll up until you find the circled spot in the photo below under the green button and then click on it.
![Step 1 - How to see the project creation process](./public/assets/images/readme/firstStep_howToReadTheCommits.png)

##

### 2 - On the right side of the commits, you'll find a <> symbol, as circled in the photo below. Click on this symbol and you'll find the code at that time and the detailed readme for that moment! ![Step 2 - How to view the project creation process](./public/assets/images/readme/secondStep_howToReadTheCommits.png)

##

### 3 - After finding everything you need, if you want to return to the current commit, click where the image below circles:
![Step 3 - How to view the project creation process](./public/assets/images/readme/thirdStep_howToReadTheCommits.png)

##

### 4 - Then click on main (where it is circled in the image below) and you will return to the last commit made!
![Step 4 - How to view the project creation process](./public/assets/images/readme/fourthStep_howToReadTheCommits.png)

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