/* eslint-disable no-undef,no-restricted-globals */
self.addEventListener('error', (e) => {
  self.clients.matchAll()
    .then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage({
          type: 'ERROR',
          msg: e.message || null,
          stack: e.error ? e.error.stack : null,
        });
      }
    });
});

self.addEventListener('unhandledrejection', (e) => {
  self.clients.matchAll()
    .then((clients) => {
      if (clients && clients.length) {
        clients[0].postMessage({
          type: 'REJECTION',
          msg: e.reason ? e.reason.message : null,
          stack: e.reason ? e.reason.stack : null,
        });
      }
    });
});

// const ignoreParams = (inputUrl, paramBlackList) => {
//   if (!inputUrl.includes('?')) {
//     return inputUrl;
//   }
//   const beforeParams = inputUrl.slice(0, inputUrl.indexOf('?'));
//   const paramsString = inputUrl.slice(inputUrl.indexOf('?') + 1);
//   const params = {};
//   paramsString.split('&').forEach((paramItem) => {
//     if (paramBlackList.includes(paramItem.split('=')[0])) {
//       return;
//     }
//     params[paramItem.split('=')[0]] = paramItem.split('=')[1];
//   });
//   return `${beforeParams}?${Object.keys(params)
//   .map(paramName => `${paramName}=${params[paramName]}`).join('&')}`;
// };

importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/',
});
workbox.core.setCacheNameDetails({
  prefix: 'wm',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime',
});
workbox.skipWaiting();
workbox.clientsClaim();
// const runtimeCacheName = workbox.core.cacheNames.runtime;
//
// const pageUrlParamBlackList = ['spm'];
// const ajaxUrlParamBlackList = ['token'];

// const pageRegs = [
//   /alibaba-inc\.com\/$/,
//   /alibaba-inc\.com\/\?/,
//   /\/project$/,
//   /\/project\?/,
//   /projects\/\d+$/,
//   /projects\/\d+\?/,
// ];
//
// const staleWhileRevalidateUrlsWithPostMessagePlugin = [
//   '/plugin/ajax/getByContainersAndRefObject',
//   '/platform/ajax/ak-my/my/openapi/ProjectService/myIssueSymmary',
//   '/platform/ajax/ak-my/my/openapi/ApplicationService/collectApplication',
//   '/platform/ajax/ak-my/my/openapi/ProjectService/collectProject',
//   '/platform/ajax/ak-my/my/openapi/ProjectService/projectIssueStatistics',
//   '/api/getProjectList',
// ];
//
// const staleWhileRevalidateRegsWithPostMessagePlugin = [
//   /\/platform\/ajax\/ak-my\/my\/openapi\/ProjectService\/myIssueList.*toPage=1/,
// ];

const staleWhileRevalidateRegList = [
  /wealth/,

  /wealthCategory/,
  /wealthRecord/,
];

workbox.routing.registerRoute(
  ({ url }) => staleWhileRevalidateRegList.filter(reg => reg.test(url) === true).length > 0,
  workbox.strategies.staleWhileRevalidate(),
);
workbox.routing.registerRoute(
  '/',
  workbox.strategies.staleWhileRevalidate(),
);

// // pages
// workbox.routing.registerRoute(
//   ({ url }) => {
//     if (pageRegs.filter(pageRegPattern => pageRegPattern.test(url.href)).length > 0) {
//       return {
//         url: ignoreParams(url.href, pageUrlParamBlackList),
//       };
//     }
//     return false;
//   }, ({ event, params }) => {
//     event.respondWith(
//       caches.open(runtimeCacheName).then(cache => cache.match(params.url).then((response) => {
//         const fetchPromise = fetch(event.request).then((networkResponse) => {
//           cache.put(params.url, networkResponse.clone());
//           return networkResponse;
//         });
//         return response || fetchPromise;
//       }))
//     );
//   });
//
// // ajax with update message
// workbox.routing.registerRoute(
//   ({ url }) => {
//     if (
//       staleWhileRevalidateUrlsWithPostMessagePlugin
//       .filter(urlPattern => url.href.includes(urlPattern)).length > 0
//     || staleWhileRevalidateRegsWithPostMessagePlugin
//     .filter(urlReg => urlReg.test(url.href)).length > 0) {
//       return {
//         url: ignoreParams(url.href, ajaxUrlParamBlackList),
//       };
//     }
//     return false;
//   },
//   ({ event, params }) => {
//     event.respondWith(
//       caches.open(runtimeCacheName).then(
//         cache => cache.match(params.url).then(
//           (response) => {
//             const fetchPromise = fetch(event.request).then((networkResponse) => {
//               cache.put(`${params.url}_new`, networkResponse.clone()).then(() => {
//                 caches.open(runtimeCacheName).then(newCache =>
//                   newCache.match(params.url).then((oldResponse) => {
//                     newCache.match(`${params.url}_new`).then((newResponse) => {
//                       newCache.put(params.url, newResponse.clone());
//                       if (newResponse) {
//                         newResponse.json().then((newBody) => {
//                           if (oldResponse) {
//                             oldResponse.json().then((oldBody) => {
//                               if (JSON.stringify(oldBody) !== JSON.stringify(newBody)) {
//                                 self.clients.matchAll().then((clients) => {
//                                   for (const client of clients) {
//                                     client.postMessage(
//                                     JSON.stringify({ result: newBody, url: params.url }));
//                                   }
//                                 });
//                               }
//                             });
//                           }
//                         });
//                       }
//                       newCache.delete(`${params.url}_new`);
//                     });
//                   })
//                 );
//               });
//               return networkResponse;
//             });
//             return response || fetchPromise;
//           }))
//     );
//   }
// );
//
// // ajax without update message
// workbox.routing.registerRoute(
//   ({ url }) => {
//     if (staleWhileRevalidateRegs.filter(urlReg => urlReg.test(url.href)).length > 0) {
//       return {
//         url: ignoreParams(url.href, ajaxUrlParamBlackList),
//       };
//     }
//     return false;
//   },
//   ({ event, params }) => {
//     event.respondWith(
//       caches.open(runtimeCacheName).then(
//         cache => cache.match(params.url).then(
//           (response) => {
//             const fetchPromise = fetch(event.request).then((networkResponse) => {
//               cache.put(`${params.url}_new`, networkResponse.clone()).then(() => {
//                 caches.open(runtimeCacheName).then(newCache =>
//                   newCache.match(params.url).then(() => {
//                     newCache.match(`${params.url}_new`).then((newResponse) => {
//                       newCache.put(params.url, newResponse.clone());
//                       // if (newResponse) {
//                       //   newResponse.json().then((newBody) => {
//                       //     if (oldResponse) {
//                       //       oldResponse.json().then((oldBody) => {
//                       //         // if (JSON.stringify(oldBody) !== JSON.stringify(newBody)) {
//                       //         //   self.clients.matchAll().then((clients) => {
//                       //         //     for (const client of clients) {
//                       //         //       client.postMessage(
//                       JSON.stringify({ result: newBody, url: event.url }));
//                       //         //     }
//                       //         //   });
//                       //         // }
//                       //       });
//                       //     }
//                       //   });
//                       // }
//                       newCache.delete(`${params.url}_new`);
//                     });
//                   })
//                 );
//               });
//               return networkResponse;
//             });
//             return response || fetchPromise;
//           }))
//     );
//   }
// );
