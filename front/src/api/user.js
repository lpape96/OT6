import API from './api';

const userService = {
  async getUserRes() {
    const res = await API.get('api/user/userRes');
    return res.data;
  },
  async postUserLogs(body) {
    await API.post('api/user/userLogs', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default userService;
