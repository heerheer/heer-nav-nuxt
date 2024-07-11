export type SearchEngine = {
  name: string;
  label: string;
  avatar: {
    icon?: string;
    url?: string;
  };
  on_search?: (text: string) => void | Promise<void>;
};

export type Site = {
  name: string;
  url: string;
  avatar?: {
    url: string
  };
  desc:string;
  type: 'common';
  category: string;
  tags: string[];
  encrypted?: {
    url: string;
    tip?: string
  }
}