<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=header"/>

# 📅 System - Fatec Itu 📅

<p align="left">
<a href="./README.md">
<img src="https://img.shields.io/badge/🌍%20Click%20here%20to%20read%20in%20portuguese!%20-purple?style=for-the-badge" alt="Button to read in Portuguese"/>
</a>
</p>

## ⭐ Front-End Repository

## 📌 About the project

### This system was developed so that events at Fatec Itu - Dom Amaury Castanho could have a more practical registration method, making it easier for students, outsiders, and event organizers. Clearly, this system is also used by event organizers to manage and control events, users, carousel, categories, local and other administrative structures.

### 👥 This system is being created by: Guilherme Francisco Pereira as a final project development / Real system

### ✨ Interesting fact: this is one of the systems developed exclusively by students that is already implemented and used by the college, benefiting students, professors, coordinators, and others involved!

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=40E0D0&height=120&section=footer"/>

##

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&section=header"/>

## 🛎️ Updates to this commit

### `./src/components/Buttons/ButtonDarkMode:` The light/dark theme toggle sat about 3px above the center of the header, because the toggle drawing rested on the button's text line and left extra space below it. It is now centered inside its own button and lines up with the "Entrar" (Sign in) button (on mobile it is now centered in the header too).

### `./src/components/Header:` The "Entrar" (Sign in) button moved up 2px on hover, and only then did it look aligned with the theme toggle. It no longer moves: on hover (and on keyboard focus) it gets slightly brighter, a stronger shadow and a shine that sweeps across it, the same effect used on the other red buttons of the system.

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer"/>

##

## 🖥 Technologies Used
<div align='center'>

!['NextJS'](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
!['TypescriptLogo'](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
!['CssLogo'](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
!['DockerLogo'](https://img.shields.io/badge/docker-257bd6?style=for-the-badge&logo=docker&logoColor=white)

</div>

## Versions used: 
    - Next: 15.5.28
    - React: 19.1.0 
    - Typescript: 5
    - Docker: 28.3.2

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

- `./.github/workflows/deploy.yml:` GitHub Actions workflow responsible for front-end CI/CD. Upon receiving a `git push` on the `main` branch, it builds the Docker image, publishes it to the GitHub Container Registry, and automatically updates the front-end container on the VPS.

- `./Dockerfile:` File responsible for defining the front-end containerization process. Uses Node.js 22 Alpine and multi-stage build to install dependencies with `npm ci`, generate the production build of Next.js with `npm run build`, and run the application in production mode.

- `./.dockerignore` Defines which files and directories should be ignored during the Docker image build.

- `./src/middleware.ts:` Edge middleware file that controls access to public and private routes based on session cookies. It considers both the access cookie and the refresh cookie, allowing the front-end to renew the session before redirecting the user when only the `access_token` has expired.`

- `./src/@Types:` Stores the typings that are reused in the code.
    - `AuditTypes:` Shared typings from the Audit screen (summary record, detailed record, listing page and filters)
    - `CarouselTypes:` Shared typings from the Carousel screen
    - `CategoriesTypes:` Shared typings from the Categories screen
    - `CertificateTypes:` Shared typings for automatic certificate management
    - `CoursesTypes:` Shared typings from the Courses screen
    - `EventTypes:` Shared typings from the Events screen
    - `LocationsTypes:` Shared typings from the Locations screen
    - `ParticipantsTypes:` Shared typings from the Participants screen
    - `UsersTypes:` Shared typings from the Users screen
    - `UserJwtProps.ts:` User typing and their roles.

- `./src/app:` This is a Next project. If you don't have any knowledge of Next, look up "App Router Next" to learn more about the project and its folder and route structure! Within the app, we have:
    - `globals.css:` Global styles, imported within our layout.tsx to be passed throughout the application. It defines the color variables of the light and dark themes (keeping the Fatec red), shadows, corners, animations and form fields, the font size that follows the screen on computers (1536 × 700 reference), the visible focus, the scrollbar and turning animations off for people who prefer less motion. It also has the `visuallyHidden` class, which hides a text from the screen but keeps it for screen readers and search engines, and the `printSurface` class, which forces the light theme colors on PDF and print.
    - `layout.tsx:` Imports global styles and the Poppins font, sets the SEO metadata (title with a per-page template, description and Open Graph), adds the organization JSON-LD (Fatec Itu), applies the saved theme before the page shows up (no flashing) and encapsulates the application.
    - `loading.tsx:` This is a special Next.js component to display something loading during data fetch or route changes. To display this to the user, we insert our Loader component.
    - `opengraph-image.tsx:` Generates the default share image (1200 × 630) with the Fatec Itu logo, used when a link to the site is sent on social networks or messaging apps.
    - `robots.ts:` Generates the `robots.txt`, allowing search engines on public pages, blocking the admin pages and pointing to the sitemap.
    - `sitemap.ts:` Generates the `sitemap.xml` with the home page and every public event, updated every 5 minutes.
- `(pages):` Contains all of our application routes, but remember, whenever they are within parent folders, that folder will not be recognized as a route! Our pages:
    - `(private):` Everything inside this folder is our private route pages, which the user must be logged in to access. The `layout.tsx` in this folder marks all these pages so they do not show up in search engines and puts all of them inside the same centered container. It contains:
        - `AdminPage.module.css:` Styles shared by the admin screens: the page container, the table cells with icon, title and detail, the status tags (chips), the registrations progress bar and the modal forms.
        - `Audit:` Audit screen, visible only to ADMIN, with a header, the table of everything that happens in the system (when, actor, what happened, affected record, result and detail), search, filters by result, area (both with `InputSelect`) and period inside a card, loading rows, pagination and the `AuditDetailModal` details modal, integrating with the API hooks in: `./src/hooks/api/Audit/` and logic in: `./src/hooks/pages/private/Audit/useAuditPage`
        - `Carousel`: Carousel management screen, with number cards (registered, showing on the site and hidden), the preview of each image in the carousel ratio (4:1), the order, the option to activate or hide and the handle to drag and change the order, plus adding, editing and deleting photos, all integrating with the API hooks in: `./src/hooks/api/Carousel` and logic in: `./src/hooks/pages/private/Carousel/useCarouselPage`
        - `Categories`: Category management screen, built with the `RecordsPage` component (number cards, search and table), responsible for displaying the list of registered categories and offering the actions to create, edit, or delete each category, integrating with the API hooks in: `./src/hooks/api/Categories/` and logic in: `./src/hooks/pages/private/Categories/useCategoriesPage`
        - `Courses`: Course management screen, built with the `RecordsPage` component, responsible for displaying the list of registered courses and offering the actions to create, edit, or delete each course, integrating with API hooks at: `./src/hooks/api/Courses/` and logic at: `./src/hooks/pages/private/Courses/useCoursesPage`
        - `Events:` Event management screen, with number cards (total, upcoming, happening today and finished), search, an All / Upcoming / Finished filter and the table with the event cover, date and time, location, registrations bar, status (Acontecendo, Hoje, Lotado, Agendado or Encerrado) and the actions for participants, public page, edit and delete, integrating with API hooks at: `./src/hooks/api/Events/` and logic at: `./src/hooks/pages/private/Events/useEventsPage`
            - `[id]:` Dynamic page used for creating and editing events, split into sections (main information, cover image, audience, location and date, time and description), with the cover image in the main column and the attendance secret word and the save button in the side column. Here, the user can fill in or change data such as name, category, course, semester, registration limit, location, date, times, speaker, description, image, event restriction rules, and secret word for attendance validation.
            - `Participants:` Page that shows who the participants of the desired event are, with the event name, date and location at the top, cards for registered, present, absent and attendance rate, search, the table with name, email, student ID, registration date and the option to mark their attendance, and the buttons to export to PDF and print.
        - `Locations:` Location management screen, built with the `RecordsPage` component, responsible for displaying the list of registered locations and offering the actions to create, edit, or delete each location, integrating with the API hooks at: `./src/hooks/api/Locations/` and the logic at: `./src/hooks/pages/private/Locations/useLocationsPage`
        - `Users:` User management screen, with cards per role (administrators, coordinators and teaching assistants), search and the table with photo or initials, email and the role highlighted, offering the actions to create, edit, or delete each user, integrating with the API hooks at: `./src/hooks/api/Users/` and the logic at: `./src/hooks/pages/private/Users/useUsersPage`
    - `(public):` Everything inside this folder is our public route pages, which the user can access even without being logged in. Here we have:
        - `page.tsx`: Our first page, also known as our "home" page, is the screen the user sees as soon as they access the site: carousel, the "Agenda de eventos da Fatec Itu" title, the filters and the event cards.
        - `Home.module.css:` Styles of the agenda header on the home screen (title with the word "eventos" underlined with an animation and subtitle).
        - `EventDetail:` Screen to show the event in more detail to unauthenticated users, also allowing them to register for the event. The `page.tsx` generates on the server the title, description, share image and JSON-LD of the event for search engines and social networks, and `EventDetailView.tsx` holds the screen: breadcrumb, cover with title, category and speaker (on computers the whole photo shows, with the leftover space filled by a blurred copy of the same image), the "Sobre o evento" and "Quem pode participar" panels, the card with date, time, location, seats (only for logged-in users) and the sign-up button, the loading skeleton and the event-not-found notice.
        - `Login:` Login screen, when accessing: /Login, built with the `AuthShell` component. The `layout.tsx` in this folder marks the login and password reset pages so they do not show up in search engines. Requests email and password for the user to access the platform. If the email and password are correct, the user moves to the 'confirm' stage where they enter the 6-digit code sent to their email to access (2FA).
            - `ResetPassword:` Screen for the user to change their password, when accessing: /Login/ResetPassword, also with the `AuthShell`. First, it requests the email and, whether it exists or not, moves to the new password step showing the neutral API message, so it does not reveal which emails have an account. Then the user enters the new password, confirms it, and enters the 6-digit code sent to the email.
        - `Verification:` Certificate verification screen, when accessing: /Verification/[token], the link in the certificate QR Code. It shows the certificate data in a card with a status icon to confirm it is authentic. The `layout.tsx` in this folder marks the page so it does not show up in search engines, since it shows the student's name and e-mail.

- `./src/components:` Where the components that will be reused in various parts of the code are located. In this project, we have the following components:
    - `AuditDetailModal:` Modal with every detail of an audit record: actor at the time, Brasília date and time, affected record, result, operation, IP, browser, the table of what changed and the previous, new and sent data and the response. It closes with the button, the Esc key or a click outside and returns focus to whatever opened it.
    - `AuthShell:` Layout of the login and password reset screens: brand panel with illustration, the "Área dos colaboradores" (staff area) badge and the system highlights on one side and the card with the form and the logo on the other.
    - `Buttons:`
        - `Button:` Default button of the system with primary, secondary, ghost and danger variants, three sizes, an icon before or after the text, full width and a shine that crosses the button on hover. With the `href` prop it becomes a link.
        - `ButtonDarkMode:` Button responsible for managing the website's dark mode (light/dark mode).
        - `ButtonRay:` Button that is reused in various parts of the code, changing the text, etc., based on props. Now with a gradient background and a shine on hover.
        - `ButtonScrollToTop:` Floating button fixed in the bottom corner of the screen that allows the user to smoothly return to the top of the page.
        - `IconButton:` Icon-only button used in the table actions (edit, delete, see participants etc.), with a name for screen readers, a tooltip on hover or keyboard focus and colors per type of action.
    - `CardEvents:` Cards that show events to unauthenticated users, they only show events that have not yet occurred, with the cover in 16:9, date badge, "Exclusivo Fatec" badge, category, date and time, location, speaker, seats bar (only for logged-in users) and animations on hover and when they appear on screen. It shows loading cards while fetching the events and a message when no event matches the filters.
    - `CarouselComponent:` Carousel component that appears on the home screen displaying images chosen by administrators/coordinators, in 4:1 (2.2:1 on phones), with arrows, indicators, pause on hover and a soft zoom on the image. It does not show when there are no active images.
    - `CodeInputValidation:` Reusable component with 6 boxes for 2FA, both to confirm login and to reset the password. It accepts pasting the whole code (Ctrl+V) into any box, ignoring spaces, dashes and text around the numbers.
    - `EmptyState:` Default notice for an empty list or content not found, with icon, title, description and an optional action.
    - `Footer:` Dark footer with the logo fully in white (including "Itu", which is red in the original image) and the agenda description, social networks, contact (phone, opening hours and address), useful links for students and the São Paulo Government logo.
    - `Header:` A component that remains fixed on all pages because it was inserted within `layout.tsx` and is located at the top of the website, with a glass effect and a shadow when the page scrolls. On non-mobile screens, it is also responsible for displaying the main navigation in a centralized area with support for dropdown and subdropdown on hover (a click does not keep the menu open; from the keyboard it opens with Tab) and the logged-in user menu (photo, name, role, "Gerenciar perfil" and "Sair"). Between 1151 px and 1366 px the items get more compact so all the admin items fit without covering the logo or the user menu. The logo is aligned to the vertical center of the header.
    - `ImageCloudinary:` Responsible for rendering images hosted on Cloudinary in an optimized way with the next Image tag, making a component that can be reused anywhere, making the image stay 100% within the parent element correctly. The `fit` and `position` props control the `object-fit` (cover by default) and the focus point, so the image is never stretched.
    - `ImageCropper:` Image crop editor opened above the screen, with crop options in the recommended size, free, 16:9, 4:3 and square. It shows the crop size, warns when the resolution or the ratio are not ideal and marks the area visible on phones.
    - `Inputs:`
        - `FiltersHome:` Combinable filters for events, filters to filter by event name, by categories and by dates based on start and end, inside a card with the "Limpar" (clear) button. On narrow phones the date fields are stacked. This filter component is used in CardEvents
        - `InputCheckbox:` Checkbox input that is reusable in code for boolean fields, with the ✓ centered in the box. With the `label` prop it becomes a bordered card that turns red when checked.
        - `InputField:` Reusable input that changes data based on received props, with the label centered in the empty field that rises letter by letter when the field is focused or filled.
        - `InputImage:` Allows you to select images by click, drag and drop, or paste. Displays a local or existing URL preview (without cropping or stretching the image), visually indicates when a file is dragged, and provides a button to remove the image, enabled only when a file is selected. With the `recommendedSize` prop, the preview follows the recommended ratio (16:6 for events and 4:1 for the carousel), and it shows the recommended image size, indicates whether the chosen image has the ideal size and allows cropping it with the `ImageCropper`.
        - `InputMultiSelect:` A customized and reusable multi-select component, allowing you to choose none, one, or multiple values via a dropdown with checkboxes. It has an "All" option when no item is selected, displays the chosen values in the field, closes automatically when clicked outside or with the Esc key (without closing the modal it is in), and supports labels, placeholders, disabled state, dynamic options, and custom className. The list opens above the page with `useFloatingDropdown`, without being cut by modals or sections, and can be navigated with the arrow keys.
        - `InputSelect:` A reusable custom select component, allowing you to replace the use of native `<select>` with a standardized interface in the project, supporting labels, placeholders, disabled state, and dynamic options. Long names wrap in the list and the Esc key closes only the open list. The list opens above the page with `useFloatingDropdown`, without being cut by modals or sections, flips upwards when there is not enough room below and can be navigated with the arrow keys.
        - `SearchInput:` Search field of the admin screens, with a magnifier icon, a label for screen readers and a button to clear the text.
    - `Loader:` Component that shows the user that something is loading, with a blurred background covering the whole screen.
    - `Modal:` This is like a "window" overlaid on top of the main interface that blocks interaction with background content until closed or confirmed. It's used to display critical information or specific action requests. It has a blurred background, an icon in the title, Cancel and Confirm buttons, closes with Esc, focuses the first field when it opens, confirms with Enter, locks the page scroll and on phones becomes a panel that slides up from the bottom of the screen.
    - `PageHeader:` Header of the admin screens with icon, title, description and the screen action buttons.
    - `RecordsPage:` Complete screen for simple records, used by Categories, Courses and Locations: header, cards with the total, the ones created in the last 30 days and the last edit, search and the table with the edit and delete actions.
    - `Reveal:` Shows content with a rising animation when it enters the screen while scrolling, with an optional delay to animate items in sequence.
    - `Sidebar:` A side menu used only on mobile screens to allow users to switch routes more easily without taking up as much screen space, including support for submenus and sub-submenus based on the same shared navigation configuration used in the Header. It shows the logged-in user card, the "Gerenciar perfil" and "Sair" buttons, closes with Esc and locks the page scroll while open.
    - `StatCard:` Card with a number of the screen (icon, label, value and detail), with colors per type and a loading state. `StatGrid` arranges the cards in a grid.
    - `Table:` Reusable table, you just need to pass the columns, the data, and the hidden columns on mobile. It shows loading rows, a progress bar while refreshing and a message when empty; on phones (up to 640 px) each row becomes a card. `TableToolbar` groups the search, the filters and the counter above the table.
    - `Toast:` Displays brief notifications. Can be reused in different scenarios by changing only the message and type props (Success, Alert, Error). It shows up as a card in the bottom corner with an icon colored by type and a close button.
    - `UserAvatar:` User photo (Cloudinary) or, when there is no photo, the name initials, in three sizes.

- `./src/hooks:` Here we will store our custom hooks with the logical parts of the application. We separate our hooks by types such as pages, components, and api. 
    - `api:` Here, HTTP methods make requests to the backend.
        - `client.ts:` Centralized client for authenticated requests. It automatically sends cookies, fetches a CSRF token when needed, intercepts `401` responses, calls the refresh route, updates the authenticated user in the store, and retries the original request once.
        - `Audit:` All requests to the backend on /audit/ routes.
            - `Get:` GET requests on /audit/ routes
                - `useGetAuditLogs:` Fetches the paginated list of audit records with search, result, area and period, warning users without permission and taking them to the home screen.
                - `useGetAuditLogById:` Fetches every detail of an audit record for the modal.

        - `Auth:` All requests to the backend on /auth/ routes.
            - `Get:` GET requests on /auth/ routes.
                - `getMe:` Used to retrieve user data from the backend, such as name, email, role, etc, using the centralized client to follow the automatic session refresh flow.
            - `Post:` POST requests in the /auth/ routes
                - `useLogin:` Requests to the backend to make the login request (generate 2FA code) and confirm the 2FA code to access the account
                - `useLogout:` Calls the logout route to allow the user to log out
                - `useResetPassword:` Requests to the backend to make the password change request (generate 2FA code) and confirm the 2FA code to change the password. It keeps the neutral message returned by the API to show on the screen.

        - `Carousel:` All requests to the backend on the /carousel/ routes
            - `Delete:` DELETE requests on the /carousel/delete/:id routes
                - `useDeleteCarousel.ts:` Hook that encapsulates the logic for removing a slide, sending DELETE requests with CSRF protection and handling failures to display error messages.
            - `Get:` GET requests on the /carousel routes
                - `useGetAllCarousels.ts:` Hook responsible for loading all slides, managing "loading" and "error" states, and exposing a refetch() function to reload data after mutation operations.
            - `Post:` POST requests on the /carousel/create routes
                - `useCreateCarousel.ts:` Hook that builds a FormData with title, order, status, and image, makes the POST call with CSRF protection, and triggers success or failure toasts.
            - `Patch:` PATCH requests on /carousel/patch/:id routes
                - `useEditCarousel.ts:` Hook for fully updating a slide (name, order, active, image), switching between multipart/form-data and JSON depending on the presence of a file and including CSRF and exception handling. The same file exports `useReorderCarousel`, which only changes the order of a slide, and `useToggleActiveCarousel`, which calls the /carousel/patch/toggle/ route to invert only the isActive field via JSON PATCH with CSRF, displaying a toast indicating "enabled" or "disabled".

        - `Categories:` All requests to the backend on the /categories/ routes
            - `Delete:` DELETE requests on /categories/ routes
                - `useDeleteCategory.ts:` Hook that encapsulates the HTTP request logic to delete a specific category, sending a CSRF-protected DELETE request and ensuring error handling to report deletion failures.
            - `Get:` GET requests on /categories/ routes
                - `useGetAllCategories.ts:` Hook that retrieves the entire list of categories via GET request, managing loading and error states, and allowing refetch after CRUD operations.
            - `Patch:` PATCH requests on /categories/patch/:id routes
                - `useEditCategory.ts:` Hook responsible for sending partial data updates for an existing category via a PATCH request with CSRF, allowing modification of only the category name. 
            - `Post:` POST requests on /categories/ routes
                - `useCreateCategory.ts:` Hook to create a new category in the system via POST request, constructing the payload typed with the category name and including CSRF protection to ensure the security of the operation.

        - `Certificate`: All requests to the back-end on the /certificates/ routes
            - `Get`: GET requests on the /certificates/ routes
                - `useGetVerifyCertificate.ts`: Hook responsible for publicly validating a certificate from the token provided in the URL, querying the back-end to verify authenticity, retrieving certificate data, and controlling loading and no-result states.

        - `Courses`: All requests to the back-end on the /courses/ routes
            - `Delete`: DELETE requests on the /courses/delete/ routes
                - `useDeleteCourses.ts`: Hook that encapsulates the HTTP request logic to delete a specific course, sending a CSRF-protected DELETE and ensuring error handling to report deletion failures.
            - `Get:` GET requests on the /courses/ routes
                - `useGetAllCourses.ts:` Hook that retrieves the entire list of courses via GET request, managing loading and error states, and allowing refetch after CRUD operations. It also exposes a public listing for selection and use in system forms.
            - `Patch:` PATCH requests on the /courses/patch/:id routes
                - `useEditCourses.ts:` Hook responsible for sending partial data updates of an existing course through a PATCH request with CSRF, allowing modification of the course name.
            - `Post:` POST requests on the /courses/create routes
                - `useCreateCourses.ts:` Hook to create a new course in the system via POST request, building the typed payload with the course name and including CSRF protection to ensure the security of the operation.

        - `Events:` All requests to the backend on /events/ routes
            - `Delete:` DELETE requests on /event/delete/:id routes
            - `useDeleteEvent.ts:` Hook that encapsulates the logic for deleting an event, sending DELETE requests with CSRF protection and handling failures to display error messages.
            - `Get:` GET requests on /event routes
            - `useGetAllEvents.ts:` Responsible for loading all events. The public listing also tells when it is still loading, so the home screen can show the loading cards.
            - `useGetEventById.ts:` Fetches the public data of an event by id for the detail screen, telling when it is still loading and warning with a toast when it cannot load.
            - `useGetAvailabilityDates.ts:` Responsible for retrieving from the database all days that have at least one available time slot at the location chosen for the event, avoiding having two events at the same location. - `useGetAvailabilityTimes.ts:` Responsible for retrieving all available times from the database to prevent one event from overlapping another on the same day, time, and location.
            - `Patch:` PATCH requests on the /event/patch/:id routes
            - `useEditEvent.ts:` Hook for editing an entire event, allowing for overriding values.
            - `Post:` POST requests on the /event/create routes
            - `useCreateEvent.ts:` Responsible for creating a new event, making the request to the backend and passing the correct values

        - `Locations:` All requests to the back-end on the /locations/ routes
            - `Delete:` DELETE requests on the /locations/delete/:id routes
                - `useDeleteLocation.ts:` Hook that encapsulates the HTTP request logic to delete a specific location, sending a CSRF-protected DELETE and handling failures to inform the user when the deletion cannot be completed.
            - `Get:` GET requests on the /locations/ routes
                - `useGetAllLocations.ts:` Hook responsible for retrieving the complete list of locations registered in the system, managing loading states, data storage, and the possibility of refetch after CRUD operations. It also exposes the public listing for dynamic use in forms and interfaces that depend on location selection.
            - `Patch:` Patch requests on the /locations/patch/:id routes
                - `useEditLocation.ts:` Hook responsible for sending partial updates of an existing location via a PATCH request with CSRF protection, allowing modification of the registered location name.
            - `Post:` Post requests on the /locations/create routes
                - `useCreateLocation.ts:` Hook to create a new location in the system via POST request, sending the location name to the back-end with CSRF protection and error handling.

        - `Participants:` All requests to the backend on the /participants/ routes
            - `Get:` GET requests on the /participants/ routes
                - `useGetAllParticipants:` Returns all participants of a given event based on the event ID provided via props
            - `Patch:` PATCH requests on the /participants/patch/:id routes
                - `useEditParticipant:` Updates the isPresent (boolean) field of the Participant table based on the event ID and, within that event, the participant ID, updating as the user updates the checkbox on the front end.
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
            - `useCarouselComponent:` Logical part of the carousel, handles automatic (every 8 seconds) or manual image scrolling with the arrows, clicking on the indicators centered at the bottom, pause on hover, etc.
        - `CodeInputValidation:`
            - `useCodeInputValidation:` Handles the logical part of two-factor authentication inputs, including spreading the digits of a pasted code across the boxes
        - `useFloatingDropdown:` Positions the lists of `InputSelect` and `InputMultiSelect` on the screen, outside the field and with the field width: it opens below or above depending on the available room, follows scrolling and the end of animations, and focuses the first option when the list is opened from the keyboard.
        - `useManageProfile:` Opens the "Gerenciar perfil" (manage profile) modal to change the user's own name and photo, used both by the user menu in the Header and by the Sidebar.
        - `useTableSearch:` Filters the list of a table by the text typed in the search, ignoring upper/lower case and accents.
    
    - `pages:` Page logic, page.tsx files located within the app
        - `(private):` Logical parts of private route pages (pages/private)
            - `Audit:`
                - `useAuditPage:` Logical parts to be used in the Audit page: filters, search with a 400 ms wait, pagination and opening the details modal
            - `Carousel:`
                - `useCarouselPage:` Logical parts to be used in the Carousel page
            - `Categories:`
                - `useCategoriesPage:` Logical parts to be used in the Categories page
            - `Courses:`
                - `useCoursesPage:` Logical parts to be used in the Courses page
            - `Events:`
                - `id:`
                    - `/useEventForm:` All logical parts of the event creation or editing screen
                - `useEventsPage:` Logical parts to be used in the Events page
            - `Locations:`
                - `useLocationsPage:` Logical parts to be used in the Locations page
            - `Users:`
                - `useUsersPage:` Logical parts to be used on the Users page
        - `(public):` Logical parts of public route pages (pages/public)
            - `EventDetail:`
                - `id:`
                    - `useEventDetailPage:` Logical parts to be used on the EventDetail page
            - `Login:`
                - `useLoginPage:` Logical parts to be used on the Login page
                - `useResetPasswordPage:` Logical parts to be used on the ResetPassword page

- `./src/stores:` Stores for the Zustand library
    - `ZustandWrapper:` Brings together all Zustand components to share in a single form for the layout.tsx
    - `useModalStore:`
        - `index.ts:` Controls the display and clears the application's modal data.
    - `useToastStore:`
        - `index.ts:` Responsible for orchestrating the display, progress animation, and automatic closing of toasts throughout the application.
    - `useUserStore:`
        - `index.ts:` To set the user in the application

- `./src/utils:` Folder that groups generic utility functions, without dependence on specific components, used throughout the application for common DOM and export operations.
    - `apiErrorMessage`: Builds the error message returned by the API: validation errors go one per line (the Toast and the Modal show the line breaks) and, when the API sends nothing, it uses the default message of each screen.
    - `auditLabels`: Translates the audit actions, areas, results, roles and fields to Portuguese and formats the values (dates in Brasília time, event times, yes/no, lists and protected values).
    - `downloadSectionAsPdf`: Function that captures a section of the page (identified by ID) and generates a PDF file with its entire extent, including A4 page breaks, always with the light theme colors. It allows the user to download any part of the interface as a portable document.
    - `fatecRa`: Removes dots, dashes and spaces from the RA (student ID) and validates the Fatec RA (13 digits with unit, course, entry year and semester, shift and enrollment number) with the same rule as the API, so the student sees the error before sending the registration.
    - `formatDate`: Date functions used by the screens: splits the event date and time, checks whether a date is within the last days, writes relative dates and returns the current time in the same format the event times are saved in, to work out the status of each event.
    - `imageCrop`: Centralizes the recommended sizes of event and carousel images and the functions that crop the image on a canvas and generate the final file sent to the API.
    - `localDate`: Returns today's date in the user's time zone in the `YYYY-MM-DD` format, used as the minimum date in date fields. `toISOString()` uses UTC and, in Brazil, after 9 p.m. it already returned the next day's date.
    - `navigationData`: File responsible for centralizing the configuration of navigation items reused in the Header and Sidebar, including internal routes, external links, dropdown, subdropdown, and visibility control based on the user's role. The Auditoria (Audit) item shows only for ADMIN.
    - `printSection`: Function that clones and prepares a section of the page (identified by ID) for printing, centering it and applying margins, maintaining the exact colors of the table header and the light theme colors even when the site is in dark mode. It serves to trigger the browser's print dialog and print only the desired content.
    - `seo`: Centralizes the site URL and description, the Fatec Itu data used in the JSON-LD, the server-side fetch of public events (with a timeout, so the page does not hang if the API is slow) and the metadata and JSON-LD of each event.
    - `wrapperVLibras`: Client utility component responsible for globally initializing the integration with the VLibras plugin within the application. It serves to make the accessibility feature of translation into Libras (Brazilian Sign Language) available on all pages when imported into `layout.tsx`.

## ❔ How to run the project on my machine?

- The project can be run in two ways, both of which will be explained below:
    - Locally, running the code on your machine.
    - Via Docker, uploading the front-end in a container, but don't forget to also download the back-end from my GitHub.

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

## 🐳 Docker Commands

### The front-end Dockerfile uses a multi-stage build with three steps:

- `deps:` Installs the project dependencies with `npm ci` from the `package.json` and `package-lock.json` files.

- `builder:` Copies the project files, reuses the installed dependencies, and runs the production build with `npm run build`.

- `runner:` Prepares the final production environment, copies the necessary files from the build, and starts the Next.js application on port `4001`.

### After creating the `Dockerfile` and configuring the service in `docker-compose.yml`, generate the image and run the container:

``` bash
docker-compose up --build -d

```

### This will:

- Generate the Docker image of the front-end
- Start the Next.js application
- Map the port configured in docker-compose.yml

### Verify that the container is indeed up and the port is mapped

``` bash
docker-compose ps

```

### Open on the port that is appearing, for example:

``` bash
http://localhost:4001

```

### To restart the frontend when the code changes:

``` bash
docker-compose restart frontend_events-fatec-itu

```

### To stop only the frontend

``` bash
docker-compose stop frontend_events-fatec-itu
```

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
