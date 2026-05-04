const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/",           alertController.list);
router.post("/",          alertController.create);
router.put("/:id",        alertController.update);
router.patch("/:id/toggle", alertController.toggle);
router.delete("/:id",     alertController.remove);

module.exports = router;
