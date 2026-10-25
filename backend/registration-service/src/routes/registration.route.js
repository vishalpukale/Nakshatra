const express = require("express");
const router = express.Router();
const HttpException = require("../utils/HttpException.utils");
const { requireAdmin } = require("../middleware/admin.middleware");
const {
  upload,
  getCountries,
  getStates,
  getCities,
  getEvents,
  getGallery,
  getSiteContent,
  getEventBySlug,
  getForm,
  createRegistration,
  createInquiry,
} = require("../controllers/registration.controller");
const {
  login,
  listRegistrations,
  listInquiries,
  listAdmins,
  createAdmin,
  updateAdminStatus,
} = require("../controllers/admin.controller");
const {
  imageUpload,
  listEvents,
  createEvent,
  updateEvent,
  removeEvent,
  listGallery,
  createGalleryImage,
  updateGalleryImage,
  removeGalleryImage,
  listStates,
  updateState,
  getSite,
  updateSite,
} = require("../controllers/adminContent.controller");

router.get("/countries", getCountries);
router.get("/getAllCountries", getCountries);
router.get("/states", getStates);
router.get("/cities", getCities);
router.get("/events", getEvents);
router.get("/gallery", getGallery);
router.get("/site", getSiteContent);
router.get("/events/:slug/form", getForm);
router.get("/events/:slug", getEventBySlug);
router.post("/registrations", (req, res, next) => {
  upload.single("auditionVideo")(req, res, (error) => {
    if (!error) return next();
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(new HttpException(400, "Audition video must be 100 MB or smaller."));
    }
    return next(new HttpException(400, error.message || "Could not upload the audition video."));
  });
}, createRegistration);
router.post("/inquiries", createInquiry);
router.post("/admin/login", login);
router.get("/admin/registrations", requireAdmin, listRegistrations);
router.get("/admin/inquiries", requireAdmin, listInquiries);
router.get("/admin/admins", requireAdmin, listAdmins);
router.post("/admin/admins", requireAdmin, createAdmin);
router.patch("/admin/admins/:id", requireAdmin, updateAdminStatus);
router.get("/admin/events", requireAdmin, listEvents);
router.post("/admin/events", requireAdmin, createEvent);
router.patch("/admin/events/:id", requireAdmin, updateEvent);
router.delete("/admin/events/:id", requireAdmin, removeEvent);
router.get("/admin/gallery", requireAdmin, listGallery);
router.post("/admin/gallery", requireAdmin, (req, res, next) => {
  imageUpload.single("image")(req, res, (error) => {
    if (!error) return next();
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(new HttpException(400, "Image must be 8 MB or smaller."));
    }
    return next(new HttpException(400, error.message || "Could not upload the image."));
  });
}, createGalleryImage);
router.patch("/admin/gallery/:id", requireAdmin, updateGalleryImage);
router.delete("/admin/gallery/:id", requireAdmin, removeGalleryImage);
router.get("/admin/states", requireAdmin, listStates);
router.patch("/admin/states/:id", requireAdmin, updateState);
router.get("/admin/site", requireAdmin, getSite);
router.put("/admin/site", requireAdmin, updateSite);

module.exports = router;
