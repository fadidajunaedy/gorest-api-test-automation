export interface User {
  id?: number;
  name: string;
  gender: "male" | "female";
  email: string;
  status: "active" | "inactive";
}
