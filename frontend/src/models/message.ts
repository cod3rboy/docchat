import { message, ai } from "../../wailsjs/go/models";
import { formatDistanceToNow } from "date-fns";

export class Message {
  public readonly id: string;
  public readonly role: string;
  public readonly content: string;
  public readonly threadId: string;
  public readonly created: Date;

  constructor(record: message.Message) {
    this.id = record.ID;
    this.role = record.Role;
    this.content = record.Content;
    this.threadId = record.Thread;
    this.created = new Date(record.Created);
  }

  public get localTimestamp(): string {
    return this.created.toLocaleString();
  }

  public get friendlyTimestamp(): string {
    return formatDistanceToNow(this.created, { addSuffix: true });
  }

  public toAssistantMessage(): ai.Message {
    return {
      Content: this.content,
      Role: this.role,
    };
  }
}
