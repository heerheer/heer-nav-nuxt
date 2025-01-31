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
  _id?: string;
  name: string;
  url: string;
  avatar?: {
    url: string;
  };
  desc: string;
  type: "common" | "repo";
  category: string;
  tags: string[];
  encrypted?: {
    url: string;
    tip?: string;
  };
};
