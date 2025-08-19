interface Chat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  users: User[];
  admin: string;
  latestMessage: Message;
  photoURL: string;
}

interface TranslatedContent {
  user: User;
  language: string;
  content: Content;
}

interface Message {
  _id: string;
  chat: string;
  sender: User;
  originalContent: Content;
  translatedContents: TranslatedContent[];
  createdAt: Date;
  updatedAt: Date;
}

interface Content {
  _id: string;
  contentType: string;
  value: string;
  uploadedBy: User;
  metadata: Record<string, unknown>;
}

type Language = {
  code: string;
  name: string;
  nativeName: string;
};
