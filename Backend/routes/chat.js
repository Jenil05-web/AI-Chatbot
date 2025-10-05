import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

//Test

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "test123",
      title: "Test Thread",
      messages: [],
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/threads",async(req,res)=>{
    try{
        const threads = await Thread.find().sort({updatedAt : -1});
        res.send(threads);

    }
    catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})

router.get("/threads/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).send("Thread not found");
    }
    
    res.send(thread);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
router.delete("/threads/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOneAndDelete({ threadId });
    if (!thread) {
      return res.status(404).send("Thread not found");
    }
    res.send("Thread deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).send("Bad Request");
  }
  try {
    let thread = await Thread.findOne({ threadId }); // Change const to let

    // Create new thread if it doesn't exist
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.substring(0, 20),
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
      thread.updatedAt = Date.now();
    }

    const aiResponse = await getOpenAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: aiResponse });
    thread.updatedAt = Date.now();
    await thread.save();
    res.send(thread);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong!");
  }
});
export default router;
