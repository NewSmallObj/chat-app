import { create } from 'zustand';
import type {MessageType} from "@/app/db/models/message"
import type { ConversationType } from "@/app/db/models/conversation"
interface ConversationStore {
  selectedConversation: string | null;
  messages:MessageType[];
  conversationList:ConversationType[];
  setSelectedConversation: (selectedConversation:string | null) => void;
  setMessages: (messages:MessageType[]) => void;
  setConversationList: (conversationList:ConversationType[]) => void;
}

const useConversation = create<ConversationStore>((set) => ({
  selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
  conversationList: [],
  setConversationList: (conversationList) => set({ conversationList }),
}));

export default useConversation;