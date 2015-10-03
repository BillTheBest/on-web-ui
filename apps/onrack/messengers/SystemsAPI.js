// Copyright 2015, EMC, Inc.

'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default {

  getSystemsCollection() {
    return new Promise((resolve, reject) => {
      http.get(API + 'ManagedSystems/Systems')
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getSystem(id) {
    return new Promise((resolve, reject) => {
      http.get(API + 'ManagedSystems/Systems/' + id)
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
