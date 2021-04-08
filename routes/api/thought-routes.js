const router = require("express").Router();
const {
	getAllThoughts,
	getThoughtById,
	createThought,
	updateThought,
	deleteThought,
	addReaction,
	removeReaction,
} = require("../../controllers/thought-controller");



router.route("/").get(getAllThoughts);

router.route("/:thoughtId").get(getThoughtById).put(updateThought);


router.route("/:userId").post(createThought);


router.route("/:userId/:thoughtId").delete(deleteThought);


router.route("/:thoughtId/reactions").post(addReaction)


router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);


module.exports = router;