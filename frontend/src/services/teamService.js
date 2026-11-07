import axiosInstance from './api/axiosInstance.js';
import API from './api/apiEndpoints.js';

export async function getTeam() {
  const { data } = await axiosInstance.get(API.TEAM);
  return data;
}

export async function inviteTeamMember(payload) {
  const { data } = await axiosInstance.post(API.TEAM, payload);
  return data;
}

export async function updateTeamMember(id, payload) {
  const { data } = await axiosInstance.put(API.TEAM_MEMBER(id), payload);
  return data;
}

export async function deleteTeamMember(id) {
  const { data } = await axiosInstance.delete(API.TEAM_MEMBER(id));
  return data;
}
