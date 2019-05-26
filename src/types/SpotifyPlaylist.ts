export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: any[][];
  name: string;
  owner: Owner;
  primary_color?: any;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

interface ExternalUrls {
  spotify: string;
}

interface Followers {
  href?: any;
  total: number;
}

interface Owner {
  display_name: string;
  external_urls: any[];
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface Tracks {
  href: string;
  items: any[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}
