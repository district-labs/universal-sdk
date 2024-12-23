export type Token = {
  address: string;
  name: string;
  symbol: string;
  img: string;
  decimals: number;
};

export type TokenItem = {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  tags?: string[];
  extensions?: {
    // biome-ignore lint/suspicious/noExplicitAny: <We expect anything here>
    [key: string]: any;
  };
};

export type TokenList = {
  name: string;
  logoURI: string;
  keywords: string[];
  tags: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
  timestamp: string;
  tokens: TokenItem[];
  version: {
    major: number;
    minor: number;
    patch: number;
  };
};
