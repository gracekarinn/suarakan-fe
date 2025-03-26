export type SubkategoriProps = {
    id: number;
    name: string;
  };
  
  export type KategoriProps = {
    id: number;
    name: string;
    subcategories: SubkategoriProps[];
  };