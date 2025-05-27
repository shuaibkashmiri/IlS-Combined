# Project Documentation: ILS Frontend

## 1. Project Overview

(TODO: Add a brief description of what the ILS Frontend project does, its main purpose, and key features.)

## 2. Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js` (Note: your project uses `src/app/page.jsx`). The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 3. Project Structure

The project follows a standard Next.js (App Router) structure:

- **`e:\Ils Final\Frontend-ILS-Vercel/`**
  - **`public/`**: Static assets publicly accessible (e.g., images, fonts).
  - **`src/`**: Main application source code.
    - **`app/`**: Core of the Next.js App Router. Contains layouts, pages, and route-specific components.
      - **`layout.js`**: The root layout for the entire application.
      - **`page.jsx`**: The main page component for the root URL (`/`).
      - **`banglore/`**: Directory defining routes under the `/banglore` path segment.
        - `layout.js`: Layout specific to `/banglore` routes.
        - `page.jsx`: Main page for `/banglore` (maps to `/banglore`).
        - `/banglore/about`: Defined by `src/app/banglore/about/`
        - `/banglore/aboutus.jsx`: (This might be a component or an older page structure. Next.js App Router prefers `page.jsx` inside a folder for a route, e.g., `aboutus/page.jsx`)
        - `/banglore/admin`: Defined by `src/app/banglore/admin/`. Contains various admin-specific pages:
          - `courses.jsx` (likely `/banglore/admin/courses` - ideally `admin/courses/page.jsx`)
          - `dashboard.jsx` (likely `/banglore/admin/dashboard` - ideally `admin/dashboard/page.jsx`)
          - `instructors.jsx` (likely `/banglore/admin/instructors` - ideally `admin/instructors/page.jsx`)
          - `page.jsx` (main page for `/banglore/admin`)
          - `settings.jsx` (likely `/banglore/admin/settings` - ideally `admin/settings/page.jsx`)
          - `students.jsx` (likely `/banglore/admin/students` - ideally `admin/students/page.jsx`)
          - `users.jsx` (likely `/banglore/admin/users` - ideally `admin/users/page.jsx`)
          - `videos.jsx` (likely `/banglore/admin/videos` - ideally `admin/videos/page.jsx`)
        - `/banglore/auth`: Defined by `src/app/banglore/auth/`
        - `/banglore/contact`: Defined by `src/app/banglore/contact/`
        - `/banglore/contact.jsx`: (Similar to `aboutus.jsx`, might be a component or older page structure)
        - `/banglore/courses`: Defined by `src/app/banglore/courses/`. Contains:
          - `page.jsx` (main page for `/banglore/courses`)
          - `[courseId]/page.jsx` (dynamic route for individual courses, e.g., `/banglore/courses/123`)
          - `metadata.js` (metadata for `/banglore/courses`)
        - `/banglore/dashboard`: Defined by `src/app/banglore/dashboard/`
        - `/banglore/dashboard.jsx`: (Similar to `aboutus.jsx`)
        - `/banglore/demo-videos`: Defined by `src/app/banglore/demo-videos/`
        - `/banglore/google-auth-callback.jsx`: Page for Google Auth callback, likely maps to `/banglore/google-auth-callback`.
        - `/banglore/home.jsx`: (Similar to `aboutus.jsx`)
        - `/banglore/inhouseadmin`: Defined by `src/app/banglore/inhouseadmin/`
        - `/banglore/instructor`: Defined by `src/app/banglore/instructor/`. Contains:
          - `page.jsx` (main page for `/banglore/instructor`)
          - `layout.js` (layout for instructor section)
          - `login/page.jsx` (route for `/banglore/instructor/login`)
          - `register/page.jsx` (route for `/banglore/instructor/register`)
        - `/banglore/not-found.jsx`: Custom 404 page for routes under `/banglore`.
        - `/banglore/testimonials.jsx`: (Similar to `aboutus.jsx`)
        - `/banglore/verify-email`: Defined by `src/app/banglore/verify-email/` (directory)
        - `/banglore/verify-email.jsx`: (Similar to `aboutus.jsx`, likely a page for `/banglore/verify-email` if the directory doesn't contain a `page.jsx`)
        - The `sharedComponents/` directory likely contains components specific to the `/banglore` section.
      - **`globals.css`**: Global styles applied to the application.
      - **`global-custom.css`**: Additional custom global styles.
      - **`assets/`**: Static assets used within the `app` directory.
      - **`favicon.ico`**: Application favicon.
      - **`metadata.js`**: Root metadata for the application.
    - **`components/`**: Reusable React components used across different parts of the application.
    - **`redux/`**: Redux state management setup.
      - **`features/`**: Contains Redux slices (e.g., `courseSlice.js`).
      - **`store.js`**: (Presumed) Redux store configuration.
    - **`auth/`**: (Presumed) Authentication related logic or components.
  - **`package.json`**: Project dependencies and scripts.
  - **`next.config.js` / `next.config.mjs`**: (Presumed) Next.js configuration file.
  - **`README.md`**: Project readme with setup instructions.
  - **`PROJECT_DOCUMENTATION.md`**: This file.

## 4. Frontend

### 4.1. Routing (Next.js App Router)

Routing is handled by the Next.js App Router, with pages and layouts defined by special files within the `src/app/` directory.

- **Root Layout**: `src/app/layout.js`
- **Homepage**: `src/app/page.jsx` (maps to `/`)
- **`/banglore` Routes**: Defined by the contents of `src/app/banglore/`.
  - `src/app/banglore/layout.js`: Layout specific to `/banglore` routes.
  - `src/app/banglore/page.jsx`: Main page for `/banglore` (maps to `/banglore`).
  - `/banglore/about`: Defined by `src/app/banglore/about/`
  - `/banglore/aboutus.jsx`: (This might be a component or an older page structure. Next.js App Router prefers `page.jsx` inside a folder for a route, e.g., `aboutus/page.jsx`)
  - `/banglore/admin`: Defined by `src/app/banglore/admin/`
  - `/banglore/auth`: Defined by `src/app/banglore/auth/`
  - `/banglore/contact`: Defined by `src/app/banglore/contact/`
  - `/banglore/contact.jsx`: (Similar to `aboutus.jsx`, might be a component or older page structure)
  - `/banglore/courses`: Defined by `src/app/banglore/courses/`
  - `/banglore/dashboard`: Defined by `src/app/banglore/dashboard/`
  - `/banglore/dashboard.jsx`: (Similar to `aboutus.jsx`)
  - `/banglore/demo-videos`: Defined by `src/app/banglore/demo-videos/`
  - `/banglore/google-auth-callback.jsx`: Page for Google Auth callback, likely maps to `/banglore/google-auth-callback`.
  - `/banglore/home.jsx`: (Similar to `aboutus.jsx`)
  - `/banglore/inhouseadmin`: Defined by `src/app/banglore/inhouseadmin/`
  - `/banglore/instructor`: Defined by `src/app/banglore/instructor/`
  - `/banglore/not-found.jsx`: Custom 404 page for routes under `/banglore`.
  - `/banglore/testimonials.jsx`: (Similar to `aboutus.jsx`)
  - `/banglore/verify-email`: Defined by `src/app/banglore/verify-email/` (directory)
  - `/banglore/verify-email.jsx`: (Similar to `aboutus.jsx`, likely a page for `/banglore/verify-email` if the directory doesn't contain a `page.jsx`)
  - The `sharedComponents/` directory likely contains components specific to the `/banglore` section.

### 4.2. Components

The following reusable components are found in `src/components/`:
- `AboutUs.jsx`
- `AlumniSlider.jsx`
- `Blogs.jsx`
- `CompanySlider.jsx`
- `Counter.jsx`
- `DemoClasses.jsx`
- `DropDownForm.jsx`
- `Footer.jsx`
- `GoogleAuthHandler.jsx`
- `Hero.jsx`
- `HorizontalRule.jsx`
- `Loading.jsx`
- `Navbar.jsx`
- `PingKeepAlive.jsx`
- `Popular.jsx`
- `RazorpayCard.jsx`
- `Testomonial.jsx` (*Note: possible typo, might be Testimonial.jsx*)
- `UserReviews.jsx`
- `VerifyEmail.jsx`
- `WhatsAppChat.jsx`
- `authModal.jsx`
(TODO: Add a brief description for each component, its props, and usage examples.)

### 4.3. Styling

- Global styles are defined in `src/app/globals.css` and `src/app/global-custom.css`.
- Component-specific styles can be achieved using CSS Modules, Tailwind CSS (if configured), or styled-components.

## 5. State Management (Redux)

The application uses Redux for state management.

- **Slices**: Defined in `src/redux/features/`.
  - `courseSlice.js`: Manages state related to courses. 
    - **Purpose**: Handles fetching, creating, updating, deleting courses, managing videos within courses, handling enrollments, course approvals/rejections by admins, tracking user progress, and search functionality.
    - **Key Async Thunks (Actions) & Associated API Calls**:
      - `getAllCoursesforAdmin`: `GET {BASE_URL}/api/admin/getallforadmin` - Fetches all courses for admin users.
      - `enrollOfflineStudentInCourse`: `POST {BASE_URL}/api/admin/enroll-offline-student-in-course/{studentId}/{courseId}` - Enrolls an offline student in a course.
      - `addCourse`: `POST {BASE_URL}/api/course/create` (multipart/form-data) - Adds a new course, including thumbnail upload.
      - `getAllCourses`: `GET {BASE_URL}/api/course/getall` - Fetches all courses for general display.
      - `getSingleCourse` (or `getSingle`): `GET {BASE_URL}/api/course/get/{id}` - Fetches details for a single course.
      - `addVideo`: `POST {BASE_URL}/api/video/add` (multipart/form-data) - Adds a video to a course, including video file upload and progress tracking.
      - `approveCourse`: `POST {BASE_URL}/api/admin/course/approve/{courseId}` - Admin action to approve a course.
      - `rejectCourse`: `POST {BASE_URL}/api/admin/course/reject/{courseId}` - Admin action to reject a course.
      - `updateCourse`: `PUT {BASE_URL}/api/course/update/{courseId}` (multipart/form-data) - Updates course details.
      - `deleteCourse`: `DELETE {BASE_URL}/api/course/delete/{courseId}` - Deletes a course.
      - `getInstructorCourses`: `GET {BASE_URL}/api/course/instructor/{instructorId}` - Fetches courses by a specific instructor.
      - `deleteVideo`: `DELETE {BASE_URL}/api/video/delete/{videoId}` - Deletes a video from a course.
      - `updateVideo`: `PUT {BASE_URL}/api/video/update/{videoId}` (multipart/form-data) - Updates video details.
      - `getMyLearning`: `GET {BASE_URL}/api/course/mylearning` - Fetches courses the current user is enrolled in.
      - `getCourseVideos`: `GET {BASE_URL}/api/video/getall/{courseId}` - Fetches all videos for a specific course.
      - `getCourseProgress`: `GET {BASE_URL}/api/course/progress/{courseId}` - Gets user's progress for a course.
      - `updateCourseProgress`: `POST {BASE_URL}/api/course/progress` - Updates user's progress in a course.
      - `getRecommendedCourses`: `GET {BASE_URL}/api/course/recommended` - Fetches recommended courses.
      - `searchCourses`: `GET {BASE_URL}/api/course/search?query={query}` - Searches for courses.
    - **State Updates**: The slice manages loading states (`isLoading`, `isUploading`), error states (`error`), course lists (`courses`, `adminCourses`), individual course details (`course`, `selectedCourse`), video lists (`videos`), user learning data (`myLearning`), progress (`courseProgress`, `uploadProgress`), and recommendations (`recommendedCourses`).
    - **Other Actions**: `setUploadProgress` (synchronous action to update video upload progress).
- **Store**: (Presumed to be configured in `src/redux/store.js`)

## 6. API Endpoints

This Next.js application consumes external API endpoints. The base URL for these APIs is defined by the `NEXT_PUBLIC_API_URL` environment variable. Key consumed endpoints (primarily identified from `courseSlice.js`) include:

- **Admin Course Management:**
  - `GET /api/admin/getallforadmin`
  - `POST /api/admin/enroll-offline-student-in-course/{studentId}/{courseId}`
  - `POST /api/admin/course/approve/{courseId}`
  - `POST /api/admin/course/reject/{courseId}`
- **General Course Management:**
  - `POST /api/course/create` (multipart/form-data)
  - `GET /api/course/getall`
  - `GET /api/course/get/{id}`
  - `PUT /api/course/update/{courseId}` (multipart/form-data)
  - `DELETE /api/course/delete/{courseId}`
  - `GET /api/course/instructor/{instructorId}`
  - `GET /api/course/search?query={query}`
- **Video Management:**
  - `POST /api/video/add` (multipart/form-data)
  - `DELETE /api/video/delete/{videoId}`
  - `PUT /api/video/update/{videoId}` (multipart/form-data)
  - `GET /api/video/getall/{courseId}`
- **User Learning & Progress:**
  - `GET /api/course/mylearning`
  - `GET /api/course/progress/{courseId}`
  - `POST /api/course/progress`
  - `GET /api/course/recommended`

(TODO: For each endpoint, specify expected request payloads/params and response structures if not clear from context. This information would typically come from the backend API's own documentation.)

The endpoint `POST /api/course/create` is used for creating courses (as seen in `courseSlice.js`).

## 7. Environment Variables

- `NEXT_PUBLIC_API_URL`: The full base URL for the backend API service (e.g., `https://api.example.com`). This is crucial for the application to connect to its backend.
(TODO: List required `.env` variables, e.g., `BASE_URL` used in `courseSlice.js`)

## 8. Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---
*This documentation is auto-generated and will be updated.*
