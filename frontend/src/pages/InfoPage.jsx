import { useState, version } from "react";

const InfoPage = () => {
  return (
    <div className="p-5">
      <header>
        <h1>Introduction to React 19 and Vite</h1>
      </header>

      <section>
        <h2>React 19</h2>
        <p>
          As of now, React 19 hasn't been officially released. However, React is
          constantly evolving, and the latest versions of React focus on
          improvements in performance, concurrency, and developer experience.
          Key features generally seen in newer React versions include:
        </p>
        <ul>
          <li>
            <strong>Concurrent Mode:</strong> Allows React to work on multiple
            tasks simultaneously, resulting in faster load times and smoother
            user experiences.
          </li>
          <li>
            <strong>React Server Components:</strong> Allows rendering some
            components entirely on the server without sending unnecessary
            JavaScript to the client.
          </li>
          <li>
            <strong>Automatic Batching:</strong> Optimizes re-rendering
            performance by grouping updates together.
          </li>
          <li>
            <strong>Improved Error Boundaries:</strong> New error boundary
            features to catch more types of errors.
          </li>
        </ul>
      </section>

      <section>
        <h2>Vite</h2>
        <p>
          Vite is a modern build tool and development server for web
          applications. It was created by Evan You (the creator of Vue.js) and
          has become increasingly popular in the React ecosystem.
        </p>

        <h3>Why Vite?</h3>
        <ul>
          <li>
            <strong>Faster Development:</strong> Vite uses ES modules and builds
            only the necessary parts of the app when you make changes. This
            makes it significantly faster than traditional bundlers like
            Webpack.
          </li>
          <li>
            <strong>Hot Module Replacement (HMR):</strong> Vite has an
            ultra-fast HMR, which makes the development experience much smoother
            by updating only the changed parts of the application.
          </li>
          <li>
            <strong>Optimized Build:</strong> For production, Vite uses Rollup
            for bundling, which gives optimized, efficient code output.
          </li>
          <li>
            <strong>Simple Setup:</strong> Vite’s setup is minimal and quick. It
            handles a lot of configurations for you out of the box.
          </li>
        </ul>
      </section>

      <section>
        <h2>Why Use React with Vite?</h2>
        <ul>
          <li>
            <strong>Faster Development Workflow:</strong> Vite’s fast hot module
            replacement (HMR) significantly reduces the time you spend waiting
            for changes to take effect. React components update instantly
            without full reloads, improving developer productivity.
          </li>
          <li>
            <strong>Improved Performance:</strong> Vite serves source code via
            native ES modules during development, which leads to faster startup
            times and instant updates as you code. In production, Vite uses
            Rollup for optimized and smaller build sizes, which makes the app
            faster.
          </li>
          <li>
            <strong>Enhanced Developer Experience:</strong> Vite is easier to
            configure and works out of the box with React, removing the need to
            spend time setting up tools like Babel or Webpack. Vite also
            includes fast TypeScript and JSX support.
          </li>
        </ul>
      </section>

      <section>
        <h2>How to Start with React and Vite: Key Steps</h2>
        <ol>
          <li>
            <strong>Install Node.js:</strong> Make sure you have Node.js
            installed on your computer. React and Vite both require Node.js to
            run. You can download it from{" "}
            <a href="https://nodejs.org">nodejs.org</a>.
          </li>
          <li>
            <strong>Create a New React App with Vite:</strong> Run the following
            command in your terminal to create a new React project using Vite:
            <pre>
              <code>npm create vite@latest my-react-app --template react</code>
            </pre>
          </li>
          <li>
            <strong>Navigate to Your Project Directory:</strong> Once the
            project is created, move into the directory:
            <pre>
              <code>cd my-react-app</code>
            </pre>
          </li>
          <li>
            <strong>Install Dependencies:</strong> Run the following command to
            install all necessary dependencies:
            <pre>
              <code>npm install</code>
            </pre>
          </li>
          <li>
            <strong>Start Development Server:</strong> Once the dependencies are
            installed, start the Vite development server:
            <pre>
              <code>npm run dev</code>
            </pre>
            This will start the development server, and you can open your app in
            the browser (typically at{" "}
            <a href="http://localhost:3000">http://localhost:3000</a>).
          </li>
          <li>
            <strong>Building for Production:</strong> Once you are ready to
            deploy, you can build your app with:
            <pre>
              <code>npm run build</code>
            </pre>
            This will generate an optimized production build in the{" "}
            <code>dist/</code> folder, which you can then deploy to your server
            or hosting platform.
          </li>
        </ol>
      </section>

      <footer>
        <h3>Key Points Summary:</h3>
        <ul>
          <li>
            <strong>React 19:</strong> A future version of React likely focusing
            on performance improvements and features like concurrent rendering
            and server-side components.
          </li>
          <li>
            <strong>Vite:</strong> A modern, fast build tool for web
            applications that provides:
            <ul>
              <li>Faster startup times and HMR</li>
              <li>Optimized production builds using Rollup</li>
              <li>Simple and minimal configuration</li>
            </ul>
          </li>
          <li>
            <strong>Why React with Vite?</strong> Better performance, faster
            builds, and a smoother development process.
          </li>
          <li>
            <strong>Getting Started:</strong>
            <ol>
              <li>Install Node.js</li>
              <li>Create a new React project using the Vite template</li>
              <li>Install dependencies and run the development server</li>
              <li>Build for production when ready</li>
            </ol>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default InfoPage;
