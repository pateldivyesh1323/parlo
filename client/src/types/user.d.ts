interface User {
  _id: string;
  name: string;
  email: string;
  firebaseId: string;
  photoURL: string;
}

interface UserSettings {
  _id: string;
  userId: string;
  translationLanguage: string;
  translateByDefault: boolean;
}
