const Landmark = require("../models/landmark");
const Event = require("../models/event");

module.exports.postEvent = async (req, res, next) => {
  console.log(req.params.id, req.body.event);
  const landmark = await Landmark.findById(req.params.id);
  if (!landmark) {
    req.flash("error", "landmark not found !!");
    res.redirect("/landmarks");
  }
  const newEvent = new Event(req.body.event);
  landmark.events.push(newEvent);
  await newEvent.save();
  await landmark.save();
  req.flash("success", "Successfully posted Event !");
  res.redirect(`/landmarks/${landmark._id}`);
};

module.exports.deleteEvent = async (req, res, next) => {
  const { id, eventId } = req.params;
  await Landmark.findByIdAndUpdate(id, {
    $pull: { events: eventId },
  });
  await Event.findByIdAndDelete(eventId);
  req.flash("success", "Successfully deleted Event !");
  res.redirect(`/landmarks/${id}`);
};
