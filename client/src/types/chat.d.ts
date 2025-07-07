interface Chat {
  _id: string;
  name: string;
  isGroupChat: boolean;
  users: User[];
  admin: User;
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
  sender: User;
  originalContent: Content;
  translatedContents: TranslatedContent[];
  createdAt: Date;
  updatedAt: Date;
}

interface Content {
  _id: string;
  contentType: ContentType;
  value: string;
  uploadedBy: User;
  metadata: Record<string, unknown>;
}

enum ContentType {
  TEXT = "text/plain",
  AUDIO = "audio/wav",
  IMAGE = "image/jpeg",
  VIDEO = "video/mp4",
  PDF = "application/pdf",
  OCTET_STREAM = "application/octet-stream",
}

type Language = {
  code: string;
  name: string;
  nativeName: string;
};
