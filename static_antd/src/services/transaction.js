import request from '../utils/request';

export async function query() {
  return request('/api/fund/transaction', {
    method: 'POST',
    body: {
      // ...params,
    },
  });
}
