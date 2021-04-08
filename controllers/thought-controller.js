const { User, Thought } = require('../models');

const thoughtController = {
    //get all
    getAllThoughts(req,res){
        Thought.find({})
        .select('-__v')
        .sort({_id:-1})
        .then((dbThoughtData)=> res.json(dbThoughtData))
        .catch((err)=>{
            console.log(err);
            res.status(400).json(err);

        })
    },
    //get by id
    getThoughtById({params},res){
        Thought.findOne({ _id: params.thought})
        .select('-__v')
        .then((dbThoughtData)=>{
            if(!dbThoughtData){
                res.status(404).json({message : 'couldnt found this thought'})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err)=>{
            console.log(err);
            res.status(400).json(err);
        });
    },
    // create thought
    createThought({params,body},res){
        Thought.create(body)
        .then(({_id})=>{
            return User.findOneAndUpdate(
                {_id:params.userId},
                {$push: {thought: _id}},
                {new: true}
            )
        })
        .then((dbUserData)=>{
            if(!dbUserData){
                res.status(404).json({ message: 'could not find this user with this Id '})
                return;
            }
            res.json(dbUserData);
        })
        .catch((err)=> res.json(err));
    },

    //update thought
    updateThought({params,body},res){
        Thought.findByIdAndUpdate({_id: params.thoughtId},body,{
            new:true
        })
        .then((dbThoughtData)=>{
            if(!dbThoughtData){
                res.status(404).json({message: "no user found with this ID" })
            return;
            }
            res.json(dbThoughtData)
        })
        .catch((err)=>{
            console.log(err);
            res.json(err);
        })
    },
    // delete thought
	deleteThought({ params }, res) {
		Thought.findOneAndDelete({ _id: params.thoughtId })
			.then((deletedThought) => {
				if (!deletedThought) {
					res.status(404).json({ message: "No thought found with this ID!" });
				}
				return User.findOneAndUpdate(
					{ _id: params.userId },
					{ $pull: { thoughts: params.thoughtId } },
					{ new: true }
				);
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},
	// add a reaction
	addReaction({ params, body }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $push: { reactions: body } },
			{ new: true, runValidators: true }
		)
			.then((dbUserData) => {
				console.log("userdata: " , dbUserData);
				if (!dbUserData) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},
	// remove a reaction
	removeReaction({ params }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $pull: { reactions: { reactionId: params.reactionId } } },
			{ new: true }
		)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.json(err));
	}
};

module.exports= thoughtController;

