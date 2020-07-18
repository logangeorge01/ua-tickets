export class Game {
   gameID: string;
   team: string;
   logo: string;
   gameday: string;
}
export class Offer {
   offerID: string;
   name: string;
   email: string;
   price: number;
   lower: boolean;
}
export class User {
   uid: string;
   email: string;
   photoURL?: string;
   displayName?: string;
   offers?: {
      gameID: string;
      price: number;
   }[];
   venmo?: string;
   phone?: string;
}
