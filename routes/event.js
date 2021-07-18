const express = require("express");
const router = express.Router({ mergeParams: true });
const catchError = require("../utils/catch-error");
const { isLoggedIn, isAuthor } = require("../middleware");

const event = require("../controller/event");

router.post("/", isLoggedIn, isAuthor, catchError(event.postEvent));

router.delete("/:eventId", isLoggedIn, isAuthor, catchError(event.deleteEvent));
module.exports = router;
