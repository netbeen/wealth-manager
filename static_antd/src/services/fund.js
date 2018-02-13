import request from '../utils/request';

export async function fundTransaction() {
  return request('/api/fundTransaction');
}
