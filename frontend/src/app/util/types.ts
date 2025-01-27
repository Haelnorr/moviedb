export type Token = {
  access_token: string;
  access_expires: number;
  refresh_token: string;
  refresh_expires: number;
};

export type User = {
  id: number;
  username: string;
  joined: Date;
  role: string;
  bio: string;
  favourites: any[];
  activity: any[];
};
