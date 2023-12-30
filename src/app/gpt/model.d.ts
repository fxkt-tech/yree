export interface ChatMessage {
  id: string;
  role_name: string;
  role: string;
  content: string;
}

export interface GPTMessage {
  role: string;
  content: string;
}

export interface Platform {
  name: string;
  value: string;
}
