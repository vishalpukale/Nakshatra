import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import { CircularLoader } from "../components";
import Navbar from "../components/navbar/Navbar";
import { RegistrationProvider } from "../modules/registration/RegistrationProvider";

const Error404 = lazy(() => import("./Error404"));
const Index = lazy(() => import("../modules/landing/container"));
const AboutUs = lazy(() => import("../modules/about-us/container"));
const EventPage = lazy(() => import("../modules/registration/EventPage"));
const ActionPage = lazy(() => import("../modules/registration/ActionPage"));
const TermsPage = lazy(() => import("../modules/registration/TermsPage"));
const AdminLogin = lazy(() => import("../modules/admin/AdminLogin"));
const AdminLayout = lazy(() => import("../modules/admin/AdminLayout"));
const EventsPage = lazy(() => import("../modules/admin/pages/EventsPage"));
const GalleryPage = lazy(() => import("../modules/admin/pages/GalleryPage"));
const StatesPage = lazy(() => import("../modules/admin/pages/StatesPage"));
const SitePage = lazy(() => import("../modules/admin/pages/SitePage"));
const RegistrationsPage = lazy(() => import("../modules/admin/pages/RegistrationsPage"));
const QueriesPage = lazy(() => import("../modules/admin/pages/QueriesPage"));
const AdminsPage = lazy(() => import("../modules/admin/pages/AdminsPage"));

const Routing = () => {
  return (
    <Router>
      <RegistrationProvider>
        <Suspense fallback={<CircularLoader />}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="events" replace />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="states" element={<StatesPage />} />
              <Route path="site" element={<SitePage />} />
              <Route path="registrations" element={<RegistrationsPage />} />
              <Route path="queries" element={<QueriesPage />} />
              <Route path="admins" element={<AdminsPage />} />
            </Route>
            <Route element={<Navbar />}>
              <Route path="/" element={<Index />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/events/:slug" element={<EventPage />} />
              <Route path="/register" element={<ActionPage intent="register" />} />
              <Route path="/become-a-partner" element={<ActionPage intent="partner" />} />
              <Route path="/join-the-mission" element={<ActionPage intent="mission" />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<Error404 />} />
            </Route>
          </Routes>
        </Suspense>
      </RegistrationProvider>
    </Router>
  );
};

export default Routing;
