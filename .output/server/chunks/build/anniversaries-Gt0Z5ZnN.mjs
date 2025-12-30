import { a as apiFetch, b as useApiFetch } from './DogHeader-WAUZOG8S.mjs';

function useAnniversaries() {
  return useApiFetch("/api/anniversaries");
}
async function createAnniversary(data) {
  return apiFetch("/api/anniversaries", {
    method: "POST",
    body: data
  });
}
async function updateAnniversary(id, data) {
  return apiFetch(`/api/anniversaries/${id}`, {
    method: "PATCH",
    body: data
  });
}
async function deleteAnniversary(id) {
  return apiFetch(`/api/anniversaries/${id}`, {
    method: "DELETE"
  });
}

export { updateAnniversary as a, createAnniversary as c, deleteAnniversary as d, useAnniversaries as u };
