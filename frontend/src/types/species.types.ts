export interface Species {
  id: string;
  name: string;
}

export interface Breed {
  id: string;
  speciesId: string;
  name: string;
}
