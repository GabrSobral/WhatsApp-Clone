export type IMessage = {
  _id: string;
  received: boolean;
  viewed: boolean;
  message: string;
  assignedTo: string;
  user: string;
  referencedTo?: IReferencedTo;
  timestamp: Date;
  public_id?: string;
}
type IReferencedTo = {
  _id: string;
  message: string;
  user: string;
}