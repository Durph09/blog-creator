import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
    try{
        const {user: {sub}} = await getSession(req,res);
        console.log("getPosts js 7 auth0 sub: ", sub)
        const client = await clientPromise;
        const db = client.db("BlogStandard");
        const userProfile = await db.collection("users").findOne({
            auth0Id: sub
        });
        console.log("getPosts js 12 userProfile: ", userProfile);

        const {lastPostDate, getNewerPosts} = req.body;
        console.log( "getPosts js 16 lastPostDate:  ", lastPostDate)

        const posts = await db
      .collection('posts')
      .find({
        userId: userProfile._id,
            created: { [getNewerPosts ? "$gt" : "$lt"]:new Date(lastPostDate.created) },
        })
        .limit(getNewerPosts ? 0 : 5)
        .sort({ created: -1})
        .toArray();
console.log("Fetched Posts getPosts js 27 looking for _id of first post", posts)
        res.status(200).json({ posts });
        return;

    }catch(e){
        console.error(e);  // Log the error
    res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});