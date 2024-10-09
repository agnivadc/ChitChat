import Conversation from "../models/chat.model.js";

export const addMsgToConversation = async (participants, msg) => {
  try {
    // Find conversation by participants
    let conversation = await Conversation.findOne({
      users: { $all: participants },
    });

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      conversation = await Conversation.create({ users: participants });
    }
    // Add msg to the conversation
    conversation.msgs.push(msg);
    await conversation.save();
  } catch (error) {
    console.log("Error adding message to conversation: " + error.message);
  }
};
