export type Token = {
  access_token: string;
  access_expires: number;
  refresh_token: string;
  refresh_expires: number;
};

export type User = {
  id: number;
  username: string;
  joined: string;
  role: string;
  bio: string;
  favourites: any[];
  activity: any[];
  fresh?: string;
};
