export type ApiStudy = {
  id: number;
  name: string;
  mode: 'demo' | 'actual';
  dataset_id: string | null;
  status: string;
  characterization: Record<string, unknown> | null;
  mix_controls: Record<string, unknown> | null;
  economics_controls: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  simulations?: ApiSimulation[];
  created_at: string;
  updated_at: string;
};

export type ApiSimulation = {
  id: number;
  study_id: number;
  name: string;
  status: string;
  replacement_value: number | null;
  replacement_basis: string | null;
  target_class: string | null;
  input: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  decision: string | null;
  run_at: string | null;
  created_at: string;
  updated_at: string;
};

const API_ENABLED = import.meta.env.VITE_API_ENABLED === 'true';
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  enabled: API_ENABLED,
  createStudy(payload: Record<string, unknown>) {
    return request<ApiStudy>('/studies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateStudy(id: number, payload: Record<string, unknown>) {
    return request<ApiStudy>(`/studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getStudy(id: number) {
    return request<ApiStudy>(`/studies/${id}`);
  },
  listSimulations(studyId: number) {
    return request<ApiSimulation[]>(`/studies/${studyId}/simulations`);
  },
  createSimulation(studyId: number, payload: Record<string, unknown>) {
    return request<ApiSimulation>(`/studies/${studyId}/simulations`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getSimulation(id: number) {
    return request<ApiSimulation>(`/simulations/${id}`);
  },
};
