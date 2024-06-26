import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
  MessageModel,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants";
import { Icon, IconButton, position } from "@chakra-ui/react";
import { MdChat, MdOutlineClose } from "react-icons/md";
import React from "react";

export interface ChatProps {
  onSend: ( arg0: any ) => void;
}

const Chat = ( { onSend } : ChatProps ) => {
  const [messages, setMessages] = useState<MessageModel[]>([
    {
      direction: "incoming",
      position: "single",
      message: "Hola, dime que información te gustaría visualizar",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSendRequest = async (_: any, message: any) => {
    const newMessage: MessageModel = {
      message,
      direction: "outgoing",
      sender: "user",
      position: "single"
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);
    const response = await axios.post(`${API_URL}/chat`, {
      message,
    });

    if (response.data.payload) onSend(response.data.payload);

    try {
      const chatGPTResponse: MessageModel = {
        message: response.data.message,
        sender: "ChatGPT",
        position: "single",
        direction: "incoming"
      };
      setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isChatOpen) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          margin: "15px",
          zIndex: 1000,
        }}
      >
        <IconButton
          icon={<Icon as={MdChat} />}
          aria-label=""
          size="lg"
          colorScheme="blue"
          isRound
          onClick={() => setIsChatOpen(true)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        height: "400px",
        width: "300px",
        right: 0,
        bottom: 0,
        margin: "15px",
      }}
    >
      <MainContainer style={{ borderRadius: "15px" }}>
        <ChatContainer>
          <ConversationHeader style={{ margin: "0px", padding: "10px" }}>
            <ConversationHeader.Content userName="Chat" />
            <ConversationHeader.Actions>
              <IconButton
                icon={<Icon as={MdOutlineClose} />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                isRound
                onClick={() => setIsChatOpen(false)}
                aria-label=""
              />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null
            }
          >
            {messages.map((message, i) => {
              // Ensure your Message component can handle the message structure, especially for messages from ChatGPT
              return <Message key={i} model={ message }/>;
            })}
          </MessageList>
          <MessageInput
            placeholder="Send a Message"
            onSend={handleSendRequest}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;