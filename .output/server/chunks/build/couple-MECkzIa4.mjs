import { b as useApiFetch } from './DogHeader-WAUZOG8S.mjs';

function useCouple() {
  return useApiFetch("/api/couple/me");
}

export { useCouple as u };
