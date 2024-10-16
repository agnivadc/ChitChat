import React, { useEffect } from "react";
import { useUsersStore } from "../zustand/useUsersStore";
import { useAuthStore } from "../zustand/useAuthStore";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";
import axios from "axios";

const ChatUsers = () => {
  const { users } = useUsersStore();
  const { authName } = useAuthStore();
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { updateChatMsgs } = useChatMsgsStore();

  const setChatReceiver = (user) => {
    updateChatReceiver(user.username);
  };

  useEffect(() => {
    const getMsgs = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_HOST}:8080/msgs`,
        {
          params: {
            sender: authName,
            receiver: chatReceiver,
          },
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.length !== 0) {
        updateChatMsgs(res.data);
      } else {
        updateChatMsgs([]);
      }
    };
    if (chatReceiver) {
      getMsgs();
    }
  }, [chatReceiver]);

  return (
    <div>
      {users.map((user, index) => (
        <div
          key={user.username}
          onClick={() => setChatReceiver(user)}
          className="bg-blue-300 rounded-xl m-3 p-5"
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default ChatUsers;
